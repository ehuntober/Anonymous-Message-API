const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticateToken = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/:senderUrl/messages', messageController.sendMessage);
router.get('/:username/messages', authenticateToken, messageController.getMessages);
router.post(
  '/:senderUrl/messages/attachments',
  upload.array('attachments'),
  messageController.uploadAttachments
);

module.exports = router;