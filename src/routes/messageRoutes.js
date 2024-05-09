const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticateToken = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/sendmessage/:recipientUrl', upload.single('attachment'), messageController.sendMessage);
router.get('/:username/messages', authenticateToken, messageController.getMessages);

module.exports = router;