const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  id: Number,
  name: String,
  lastMessage: String
});

module.exports = mongoose.model('Chat', chatSchema, 'chats'); 
// Explicitly use 'chats' collection in MongoDB
