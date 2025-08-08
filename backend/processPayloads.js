const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const Message = require('./models/Message');

const PAYLOAD_DIR = path.join(__dirname, 'payloads');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    processFiles();
  })
  .catch(err => console.error('MongoDB error:', err));

async function processFiles() {
  const files = fs.readdirSync(PAYLOAD_DIR).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(PAYLOAD_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const payload = JSON.parse(content);

    try {
      const entry = payload.metaData?.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;

      if (value?.messages) {
        for (const msg of value.messages) {
          await Message.create({
            wa_id: value.contacts?.[0]?.wa_id || '',
            name: value.contacts?.[0]?.profile?.name || '',
            number: value.contacts?.[0]?.wa_id || '',
            message: msg.text?.body || '',
            timestamp: new Date(Number(msg.timestamp) * 1000),
            status: 'sent',
            msg_id: msg.id
          });
          console.log(`📥 Inserted message from ${value.contacts?.[0]?.wa_id}`);
        }
      }

      if (value?.statuses) {
        for (const status of value.statuses) {
          const result = await Message.findOneAndUpdate(
            { msg_id: status.id },
            { status: status.status }
          );
          if (result) {
            console.log(`📌 Updated status for msg_id: ${status.id} → ${status.status}`);
          } else {
            console.log(`⚠️ No message found with msg_id: ${status.id}`);
          }
        }
      }

    } catch (err) {
      console.error(`❌ Error in ${file}:`, err.message);
    }
  }

  console.log('✅ All payloads processed.');
  mongoose.disconnect();
}
