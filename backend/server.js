const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/product');
const FB = require('./facebookapi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('./models/user'); // MongoDB User Model
const cookieRoutes = require('./routes/cookies');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,
   {}).then(() => console.log('MongoDB Connected'));

// Initialize the Google OAuth2 client
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // The user is an admin, proceed to the next middleware or route
  } else {
    return res.status(403).send('Access denied. Admins only.');
  }
};

// Middleware to authenticate JWT
const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from headers

  if (!token) {
    return res.sendStatus(401); // Unauthorized if token is not provided
  }

  try {
    // Try verifying the JWT token with your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next(); // Valid token, proceed to the next middleware
  } catch (err) {
    // If verification fails, it might be a Google token
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.REACT_APP_GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      });
      req.user = ticket.getPayload(); // Store user information in req.user
      return next(); // Valid Google token, proceed to the next middleware
    } catch (error) {
      console.error('Invalid token:', error);
      return res.sendStatus(403); // Forbidden if the token is invalid
    }
  }
};

// Routes
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get('/api/pagereviews', async (req, res, next) => {
  try {
    const reviews = await FB.getPageReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
  
});

app.get('/api/getlastdataphoto', async (req, res, next) => {
  try {
    const lastPostId = await FB.getLastPost();
    const photo = await FB.getPostPicture(lastPostId);
    res.json(photo);
  } catch (error) {
    next(error);
  }
  
});

app.get('/api/getlastdatacomments', async (req, res, next) => {
  try{
    const lastPostId = await FB.getLastPost();
    const comments = await FB.getPostComments(lastPostId);
    res.json(comments);
  } catch (error) {
      next(error);
  }
});

// Middleware to serve static images
app.use('/images', express.static('images'));

// Use the cookies routes
app.use('/api/cookies', cookieRoutes);


// Email Sign Up
app.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    let user = await User.findOne({ email });ד

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword, name });
    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Email Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/admin', authenticateJWT, checkAdmin, (req, res) => {
  res.sendStatus(200);
});

// Token verification route
app.get('/verify-token', authenticateJWT, (req, res) => {
  res.sendStatus(200); // Send 200 OK if the token is valid
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.response.data.error.message || 'Internal Server Error',
    },
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
