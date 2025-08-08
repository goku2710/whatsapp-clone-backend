const Message = require('../models/Message');

// Insert or update webhook payload
const insertPayloads = async (req, res) => {
  try {
    const payload = req.body;

    if (payload.messages) {
      for (const msg of payload.messages) {
        await Message.create({
          wa_id: payload.contacts?.[0]?.wa_id || '',
          name: payload.contacts?.[0]?.profile?.name || '',
          number: payload.contacts?.[0]?.wa_id || '',
          message: msg.text?.body || '',
          timestamp: new Date(msg.timestamp * 1000),
          status: 'sent',
          msg_id: msg.id,
        });
      }
    }

    if (payload.statuses) {
      for (const status of payload.statuses) {
        await Message.findOneAndUpdate(
          { msg_id: status.id },
          { status: status.status }
        );
      }
    }

    res.status(200).json({ message: 'Payload processed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllChats = async (req, res) => {
  try {
    const chats = await Message.aggregate([
      {
        $group: {
          _id: '$wa_id',
          name: { $first: '$name' },
          number: { $first: '$number' },
          lastMessage: { $last: '$message' },
          lastTimestamp: { $last: '$timestamp' }
        }
      },
      { $sort: { lastTimestamp: -1 } }
    ]);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMessagesByUser = async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.wa_id }).sort('timestamp');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { wa_id, name, number, message } = req.body;
    const newMessage = await Message.create({
      wa_id,
      name,
      number,
      message,
      timestamp: new Date(),
      status: 'sent',
      msg_id: 'manual-' + Date.now()
    });
    res.status(200).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  insertPayloads,
  getAllChats,
  getMessagesByUser,
  sendMessage
};
