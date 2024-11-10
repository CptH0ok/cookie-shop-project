// cookiesapi.js

const express = require('express');
const Cookie = require('./models/cookie.js');
const app = express.Router();
const {authenticateJWT, checkAdmin, checkPermissions} = require('./middlewares');

//1. list all cookies
app.get('/', async (req, res) => {
    try {
      const cookies = await Cookie.find({});
      //console.log('Fetched cookies:', cookies); // Log the cookies retrieved
      res.json(cookies);
    } catch (err) {
      console.error('Error fetching cookies:', err); // Log any errors
      res.status(500).json({ message: err.message });
    }
  });
  
//2. Search and filter by category, name (in sensitive) and stock status - if we want to add more fields we can
app.get('/search', async (req, res) => {
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
  
  
//3. Fetch unique categories from cookies - for the filter bar.
//can also do it staticly if we prefer and delete this
app.get('/categories', async (req, res) => {
    try {
        const cookies = await Cookie.find({});
        const uniqueCategories = [...new Set(cookies.map(cookie => cookie.category))];
        res.json(uniqueCategories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ message: err.message });
    }
  });

/*4. create new cookie - only admins should be able to do it
so it checks if the user is authenticated and is an admin*/
app.post('/create', authenticateJWT, checkAdmin, async (req, res) => {
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
  
/*5. updating an existing cookie - only admins should be able to do it
  doing it by the name of the cookie and not by _id (for the admins convenience)
  it is case-insensitive*/
  
app.put('/update/:name', authenticateJWT, checkAdmin, async (req, res) => {
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
  
//6. delete a cookie by name (case-insensitive) - only for admins
app.delete('/delete/:name', authenticateJWT, checkAdmin, async (req, res) => {
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

//7. group by query as requestd - count cookies in each category
app.get('/group-by-category', async (req, res) => {
  try {
    const result = await Cookie.aggregate([
      {
        $group: {
          _id: '$category', // Group by the 'category' field
          count: { $sum: 1 }, // Count the number of cookies in each category
        },
      },
      { $sort: { count: -1 } }, // Sort by count in descending order
    ]);

    res.json(result); // Send back the grouped result
  } catch (error) {
    console.error('Error in group by category query:', error);
    res.status(500).send('Error in group by category query');
  }
});

module.exports = app;
