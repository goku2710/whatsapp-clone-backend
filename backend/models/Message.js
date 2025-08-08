const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  wa_id: String,
  name: String,
  number: String,
  message: String,
  timestamp: Date,
  status: String,
  msg_id: String
});

module.exports = mongoose.model('Message', messageSchema);
