const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/product');
const FB = require('./facebookapi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const branchesApi = require('./branchesapi');
const usersApi = require('./usersapi');
const convertCurrency = require('./currencyapi');
const {authenticateJWT, checkAdmin, checkPermissions} = require('./middlewares');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/branches', branchesApi);
app.use('/api/users', usersApi);
app.use('/api/currency', convertCurrency);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {dbName: 'cookie_DB'}
   {dbName: "cookie_DB"}).then(() => console.log('MongoDB Connected'));

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

//using the authenticateJWT just to parse the token
app.get('/api/googlelogin', authenticateJWT, async(req, res) => {
  const [email, name] = [req.user.email, req.user.name];

  let user = await User.findOne({ email });

  if (user) {
    console.info('User already exists in db');
  }

  else{
    user = new User({ email, name, role: 'admin' });
    await user.save();
  }

  res.sendStatus('200');
});

// Email Sign Up
app.post('/api/signup', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword, name });
    await user.save();

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Email Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'No such user' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin', authenticateJWT, checkAdmin, (req, res) => {
  res.json('Welcome "' + req.user.name + '" to admin panel!');
});

// Token verification route
app.get('/api/verify-token', authenticateJWT, (req, res) => {
  res.status(200).json({ name: req.user.name}); // Send 200 OK if the token is valid
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
