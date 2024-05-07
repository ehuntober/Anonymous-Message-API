const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')
const RefreshToken = require('../models/refreshTokenModel');


exports.register = async (req,res) =>{
    try{
        const {username, password, email}  = req.body;


        // check if the username already 

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
          return res.status(400).json({ message: 'Username or email already exists' });
        }

        const url = `${process.env.HOSTED_URL}/${username}`;

        // create a new user
        const newUser = new User({username, email, password, url});
        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully'
        })


    } catch(err){
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}


exports.login = async(req,res) =>{
    try{
        const {username, password} = req.body;

        // find the user by username
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }

        // compare the provided password with the stored password

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: 'Invalid credential'});
        }

        // Generate a JWT token

  // Generate a JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

   res.cookies(token)
  res.status(200).json({ token });
} catch (err) {
    console.log(err)
  res.status(500).json({ message: 'Internal server error' });
}
};




exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }
  
    try {
      const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const userId = decodedToken.userId;
  
      const storedToken = await RefreshToken.findOne({ token: refreshToken, userId });
  
      if (!storedToken) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
  
      if (storedToken.expiryDate < new Date()) {
        await RefreshToken.deleteOne({ _id: storedToken._id });
        return res.status(401).json({ message: 'Refresh token has expired' });
      }
  
      const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      const newRefreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
      });
  
      await RefreshToken.deleteOne({ _id: storedToken._id });
      const newStoredRefreshToken = new RefreshToken({
        token: newRefreshToken,
        userId,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await newStoredRefreshToken.save();
  
      res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
