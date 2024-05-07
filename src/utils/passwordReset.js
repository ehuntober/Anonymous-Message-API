const nodemailer = require('nodemailer');
const crypto = require('crypto');

const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const transporter = nodemailer.createTransport({
      // Configure your email transport options (e.g., SMTP, SendGrid, etc.)
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Instructions',
      text: `Click the following link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending password reset email:', err);
  }
};

const generateResetToken = () => {
  const resetToken = crypto.randomBytes(20).toString('hex');
  // Store the resetToken in the database for the user
  return resetToken;
};

module.exports = { sendPasswordResetEmail, generateResetToken };