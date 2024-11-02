const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const FB = require('./facebookapi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const branchesApi = require('./branchesapi');
const convertCurrency = require('./currencyapi')
const Cookie = require('./models/cookie.js');
const {authenticateJWT, checkAdmin, checkPermissions} = require('./middlewares');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/branches', branchesApi);
app.use('/api/users', usersApi);
app.use('/api/currency', convertCurrency);

// Serve static images from the "images" folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,
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

//list all cookies
app.get('/api/cookies', async (req, res) => {
  console.log('Fetching cookies');
  try {
    const cookies = await Cookie.find({});
    console.log('Fetched cookies:', cookies); // Log the cookies retrieved
    res.json(cookies);
  } catch (err) {
    console.error('Error fetching cookies:', err); // Log any errors
    res.status(500).json({ message: err.message });
  }
});

// Search and filter by category, name (in sensitive) and stock status - if we want to add more fields we can
app.get('/api/cookies/search', async (req, res) => {
  const { name, category, available } = req.query;

  // Building the filter object based on query parameters
  let filter = {};

  // Search by name if provided
  if (name) {
      filter.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search
  }

  // Search by category if provided
  if (category) {
      filter.category = category; // Assuming exact match
  }

  // Search by availability if provided
  if (available !== undefined) {
      filter.available = available === 'true'; // Convert string to boolean
  }

  try {
      const cookies = await Cookie.find(filter);
      res.json(cookies);
  } catch (err) {
      console.error('Error fetching filtered cookies:', err);
      res.status(500).json({ message: err.message });
  }
});


// Fetch unique categories from cookies - for the filter bar.
//can also do it staticly if we prefer and delete this
app.get('/api/cookies/categories', async (req, res) => {
  try {
      const cookies = await Cookie.find({});
      const uniqueCategories = [...new Set(cookies.map(cookie => cookie.category))];
      res.json(uniqueCategories);
  } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ message: err.message });
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

/*create new cookie - only admins should be able to do it
so it checks if the user is authenticated and is an admin*/
app.post('/api/cookies', authenticateJWT, checkAdmin, async (req, res) => {
  const { name, description, price, category, available, imageUrl } = req.body;

  try {
    const newCookie = new Cookie({
      name,
      description,
      price,
      category,
      available,
      imageUrl
    });

    await newCookie.save();
    res.status(201).json(newCookie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*updating an existing cookie - only admins should be able to do it
doing it by the name of the cookie and not by _id (for the admins convenience)
it is case-insensitive*/

app.put('/api/cookies/:name', authenticateJWT, checkAdmin, async (req, res) => {
  const cookieName = decodeURIComponent(req.params.name);
  const updatedData = req.body;

  try {
    const updatedCookie = await Cookie.findOneAndUpdate(
      { name: new RegExp(`^${cookieName}$`, 'i') }, // case-insensitive regex for name
      updatedData,
      { new: true }
    );

    if (!updatedCookie) {
      return res.status(404).json({ message: 'Cookie not found' });
    }

    res.json(updatedCookie);
  } catch (err) {
    console.error('Error updating cookie:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// delete a cookie by name (case-insensitive) - only for admins
app.delete('/api/cookies/:name', authenticateJWT, checkAdmin, async (req, res) => {
  try {
    const cookieName = req.params.name;
    const deletedCookie = await Cookie.findOneAndDelete({
      name: { $regex: new RegExp(`^${cookieName}$`, "i") } // Case-insensitive match
    });

    if (!deletedCookie) {
      return res.status(404).json({ message: "Cookie not found" });
    }

    res.json({ message: "Cookie deleted successfully", deletedCookie });
  } catch (error) {
    res.status(500).json({ message: error.message });
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


//update cookie by id
/*app.put('/api/cookies/:id', authenticateJWT, checkAdmin, async (req, res) => {
  try {
    const updatedCookie = await Cookie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCookie) return res.status(404).json({ message: 'Cookie not found' });
    res.json(updatedCookie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/cookies/:id', authenticateJWT, checkAdmin, async (req, res) => {
  try {
    const deletedCookie = await Cookie.findByIdAndDelete(req.params.id);
    if (!deletedCookie) return res.status(404).json({ message: 'Cookie not found' });
    res.json({ message: 'Cookie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//search cookies by category
app.get('/api/cookies/search', async (req, res) => {
  const { category } = req.query;

  try {
    const cookies = await Cookie.find({ category });
    res.json(cookies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
*/

