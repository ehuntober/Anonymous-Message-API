



const User = require('../models/userModel');

exports.getUser = async (req, res) => {
  try {
    const username = req.params.username;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ url: user.url });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};