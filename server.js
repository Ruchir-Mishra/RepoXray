require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware so your server can understand web requests
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// A simple test route to make sure it's working
app.get('/', (req, res) => {
  res.send('RepoXray Backend is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});