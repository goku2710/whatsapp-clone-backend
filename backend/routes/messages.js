const express = require('express');
const router = express.Router();
const {
  insertPayloads,
  getAllChats,
  getMessagesByUser,
  sendMessage
} = require('../controllers/messagesController');

// Routes
router.post('/webhook', insertPayloads);
router.get('/chats', getAllChats);
router.get('/messages/:wa_id', getMessagesByUser);
router.post('/send', sendMessage);

module.exports = router;
