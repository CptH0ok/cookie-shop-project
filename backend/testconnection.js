const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Define your MongoDB URI
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB Connected successfully');
    mongoose.connection.close(); // Close the connection after testing
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
