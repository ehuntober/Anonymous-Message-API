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
      return res.status(400).json({ message: 'Message content not allowed, use less offensive words and try again' });
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
    if (req.file) {
      newMessage.attachments.push(req.file.path);
    }

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// exports.sendMessage = async (req, res) => {
//   try {
//     const username = req.params.username;
//     const { content } = req.body;
//     const recipientUsername = username;
//     // Moderate the message content
//     const moderatedContent = await moderateContent(content);
//     if (!moderatedContent.isAllowed) {
//       return res.status(400).json({ message: 'Message content not allowed, use less offensive words and try again' });
//     }
//     // Find the recipient user
//     const recipientUser = await User.findOne({ username: recipientUsername });
//     if (!recipientUser) {
//       return res.status(404).json({ message: 'Recipient not found' });
//     }
//     // Create a new message
//     const newMessage = new Message({
//       content: moderatedContent.content,
//       recipient: recipientUser._id,
//     });
//     // Handle attachments if provided
//     if (req.files && req.files[0]) {
//       const attachment = req.files[0].path;
//       newMessage.attachments.push(attachment);
//     }
//     await newMessage.save();
//     res.status(201).json({ message: 'Message sent successfully' });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.userId });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

