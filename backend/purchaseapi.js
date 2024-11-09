const express = require('express');
const router = express.Router();
const PurchaseHistory = require('./models/purchasehistory');
const {authenticateJWT, checkAdmin} = require('./middlewares');

router.get('/list', async (req, res) => {
    try {
        const purchases = await PurchaseHistory.find().populate('memberId','name');
        res.json(purchases);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching purchases', error });
    }
});

module.exports = router;


