//retrieve the cookies from the DB

const express = require('express');
const Cookie = require('../models/cookie');
const router = express.Router();

// Get all cookies
router.get('/', async (req, res) => {
  try {
    const cookies = await Cookie.find({});
    res.json(cookies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
