import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import HomePage from './pages/homepage';
import ShopPage from './pages/shoppage';
import Reviews from './pages/reviews';
import Login from './pages/login';  // Login component
import Signup from './pages/signup';  // Signup component
import Maps from './pages/maps'
import ProtectedRoute from './components/ProtectedRoute';  // The protected route component
import LoginSuccess from './components/LoginSuccess';
import Admin from './pages/admin';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Handle Google Login Success */}
        <Route path="/login/success" element={<LoginSuccess />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/shop" element={<ProtectedRoute element={<ShopPage />} />} />
        <Route path="/maps" element={<ProtectedRoute element={<Maps />} />} />
        <Route path="/reviews" element={<ProtectedRoute element={<Reviews />} />} />
        <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />

        {/* Wildcard route: Let backend handle unhandled paths*/}
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
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
