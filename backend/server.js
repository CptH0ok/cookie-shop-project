const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const boom = require('@hapi/boom');
const facebookApi = require('./facebookapi');
const usersApi = require('./usersapi');
const cartApi = require('./cartapi');
const cookiesApi = require('./cookiesapi');
const branchesApi = require('./branchesapi');
const convertCurrency = require('./currencyapi')
const securityApi = require('./security');
const {authenticateJWT, checkAdmin} = require('./middlewares');
const purchaseHistory = require('./purchasehistoryapi');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/branches', branchesApi);
app.use('/api/users', usersApi);
app.use('/api/cart', cartApi);
app.use('/api/facebook', facebookApi );
app.use('/api/currency', convertCurrency);
app.use('/api/cookies', cookiesApi )
app.use('/api/purchasehistory', purchaseHistory);
app.use('/api/security', securityApi );
app.use('/api/branches', branchesApi );
app.use('/api/currency', convertCurrency );

// Serve static images from the "images" folder
app.use('/images', express.static(path.join(__dirname, 'images')));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {dbName: 'cookie_DB'}
  ).then(() => console.log('MongoDB Connected'));

app.get('/api/admin', authenticateJWT, checkAdmin, (req, res) => {
  res.json('Welcome "' + req.user.name + '" to admin panel!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (!err.isBoom) {
    next(err);
    return;
  }
  const { output } = err;
  res.status(output.statusCode).json({ error: output.payload });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));


