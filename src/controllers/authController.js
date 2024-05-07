const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')


exports.register = async (req,res) =>{
    try{
        const {username, password, email}  = req.body;


        // check if the username already 

        const existingUser = await User.findOne({username});
        if (existingUser){
            return res.status(400).json({
                message: "Username already exists"
            })
        }

        const url = `process.env.HOSTED_URL/${username}`;

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
    expiresIn: '1h',
  });

  res.status(200).json({ token });
} catch (err) {
  res.status(500).json({ message: 'Internal server error' });
}
};


