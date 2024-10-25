import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './appcontent';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


// server/app.js

const express = require('express');
const mongoose = require('mongoose');
const cookieRoutes = require('./routes/cookies');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cookieshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware to serve static images
app.use('/images', express.static('images'));

// Use the cookies routes
app.use('/api/cookies', cookieRoutes);

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
