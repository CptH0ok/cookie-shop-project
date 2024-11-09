const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const app = express();
const cors = require('cors');
const FB = require('./facebookapi');
const mongoose = require('mongoose');
const usersApi = require('./usersapi');
const securityApi = require('./security');
const cookiesApi = require('./cookiesapi');
const branchesApi = require('./branchesapi');
const convertCurrency = require('./currencyapi');
const purchasesApi = require('./purchaseapi');
const {authenticateJWT, checkAdmin} = require('./middlewares');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/users', usersApi );
app.use('/api/cookies', cookiesApi );
app.use('/api/security', securityApi );
app.use('/api/branches', branchesApi );
app.use('/api/currency', convertCurrency );
app.use('/api/purchases', purchasesApi );

// Serve static images from the "images" folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {dbName: 'cookie_DB'}
  ).then(() => console.log('MongoDB Connected'));


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

app.get('/api/admin', authenticateJWT, checkAdmin, (req, res) => {
  res.json('Welcome "' + req.user.name + '" to admin panel!');
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


