require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Configure CORS so only your Vercel frontend & localhost can call the API
app.use(cors({
  origin: [
    "https://whats-app-web-clone-nxpw.vercel.app", // your Vercel frontend domain
    "http://localhost:3000" // for local development
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// MongoDB connection
console.log('Loaded MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    // Start server only after DB connects
    app.listen(process.env.PORT || 10000, () => {
      console.log(`Server running on port ${process.env.PORT || 10000}`);
    });
  })
  .catch(err => console.log(err));

// =============================
// Routes
// =============================

// Example static chats route (replace with DB queries later)
app.get("/chats", (req, res) => {
  res.json([
    { id: 1, name: "John Doe", lastMessage: "Hello!" },
    { id: 2, name: "Jane Smith", lastMessage: "How are you?" }
  ]);
});

// Get messages by user id
app.get("/messages/:wa_id", (req, res) => {
  const { wa_id } = req.params;
  // TODO: Replace with DB query
  res.json([
    { from: "user", text: `Messages for user ${wa_id}` }
  ]);
});

// Send a message
app.post("/send", (req, res) => {
  const { to, text } = req.body;
  // TODO: Store in DB and send via WhatsApp API
  res.json({ success: true, to, text });
});
