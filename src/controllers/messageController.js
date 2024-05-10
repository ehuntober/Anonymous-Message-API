const Message = require('../models/messageModel');
const User = require('../models/userModel');
const moderateContent = require('../utils/moderation');
const upload = require('../middlewares/upload');

exports.sendMessage = async (req, res) => {
  try {
    const username = req.params.username;
    const { content } = req.body;
    const recipientUsername = username;
    // Moderate the message content
    const moderatedContent = await moderateContent(content);
    if (!moderatedContent.isAllowed) {
      return res.status(400).json({ message: 'Message content not allowed use less offensive words' });
    }
    // Find the recipient user
    const recipientUser = await User.findOne({ username: recipientUsername });
    if (!recipientUser) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    // Create a new message
    const newMessage = new Message({
      content: moderatedContent.content,
      recipient: recipientUser._id,
    });
    // Handle attachments if provided
    if (req.files && req.files[0]) {
      const attachment = req.files[0].path;
      newMessage.attachments.push(attachment);
    }
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipientId: req.userId });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// exports.getMessages = async (req, res) => {
//   try {
//     const username = req.params.username;


//     // Find the user by username
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Find all messages for the user
//     const messages = await Message.find({ recipient: user._id }).sort({ createdAt: -1 });

//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };