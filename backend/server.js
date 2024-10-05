const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/product');
const FB = require('./facebookapi');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,
   {}).then(() => console.log('MongoDB Connected'));

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
