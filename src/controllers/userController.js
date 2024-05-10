const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { sendPasswordResetEmail, generateResetToken } = require('../utils/passwordReset')


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


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate a password reset token and send an email with instructions
      const resetToken = generateResetToken();
      const resetUrl = `${process.env.HOSTED_URL}/reset-password?token=${resetToken}`;
  
      sendPasswordResetEmail(email, resetUrl);
  
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      // Validate the reset token and find the user
      const user = await User.findOne({ resetToken: token });
  
      if (!user) {
        return res.status(404).json({ message: 'Invalid reset token' });
      }
  
      // Update the user's password
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetToken = null;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid current password' });
      }
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  exports.updateUsername = async (req, res) => {
    const { newUsername } = req.body;
    const userId = req.userId;
  
    try {
      const existingUser = await User.findOne({ username: newUsername });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const newUrl = `${process.env.HOSTED_URL}/${newUsername}`;
      user.username = newUsername;
      user.url = newUrl;
      await user.save();
  
      res.status(200).json({ message: 'Username updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };