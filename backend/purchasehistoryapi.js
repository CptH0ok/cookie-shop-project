const express = require('express');
const router = express.Router();
const PurchaseHistory = require('./models/purchasehistory');
const User = require('./models/user');
const { authenticateJWT } = require('./middlewares');  // Same as cartapi
const mongoose = require('mongoose');

router.post('/create', authenticateJWT, async (req, res) => {
  const { userId, items, totalAmount } = req.body;

  console.log('Create purchase history start:', { userId, items, totalAmount });

  try {
    // Validate input
    if (!userId || !items || !totalAmount) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new purchase history record
    const purchaseHistory = new PurchaseHistory({
      memberId: userId,
      items: items.map(item => ({
        itemName: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: totalAmount
    });

    // Save the purchase history
    await purchaseHistory.save();

    console.log('Purchase history saved successfully');
    res.status(200).json({ 
      message: 'Purchase history created successfully',
      purchaseHistory
    });

  } catch (error) {
    console.error('Error creating purchase history:', error);
    res.status(500).json({ error: 'Failed to create purchase history' });
  }
});



// Get a specific purchase record
router.get('/purchase/:purchaseId', authenticateJWT, async (req, res) => {
  try {
    const { purchaseId } = req.params;
    console.log('Fetch specific purchase request:', { purchaseId });

    // Validate input
    if (!purchaseId) {
      console.log('Missing purchase ID');
      return res.status(400).json({ error: 'Missing purchase ID' });
    }

    // Find the specific purchase record
    const purchase = await PurchaseHistory.findById(purchaseId)
      .populate('memberId', 'name email')
      .exec();

    if (!purchase) {
      console.log('Purchase record not found');
      return res.status(404).json({ error: 'Purchase record not found' });
    }

    console.log('Sending purchase record');
    res.status(200).json({
      message: 'Purchase record retrieved successfully',
      purchase: purchase
    });

  } catch (error) {
    console.error('Error fetching purchase record:', error);
    res.status(500).json({ error: 'Failed to fetch purchase record' });
  }
});

// Delete a purchase record (optional, depending on your needs)
router.delete('/delete/:purchaseId', authenticateJWT, async (req, res) => {
  try {
    const { purchaseId } = req.params;
    console.log('Delete purchase request:', { purchaseId });

    // Validate input
    if (!purchaseId) {
      console.log('Missing purchase ID');
      return res.status(400).json({ error: 'Missing purchase ID' });
    }

    // Find and delete the purchase record
    const deletedPurchase = await PurchaseHistory.findByIdAndDelete(purchaseId);

    if (!deletedPurchase) {
      console.log('Purchase record not found');
      return res.status(404).json({ error: 'Purchase record not found' });
    }

    console.log('Purchase record deleted');
    res.status(200).json({
      message: 'Purchase record deleted successfully',
      purchaseHistory: deletedPurchase
    });

  } catch (error) {
    console.error('Error deleting purchase record:', error);
    res.status(500).json({ error: 'Failed to delete purchase record' });
  }
});

// Get purchase statistics for a user (optional feature)
router.get('/stats/:userId', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetch purchase stats request:', { userId });

    // Validate input
    if (!userId) {
      console.log('Missing user ID');
      return res.status(400).json({ error: 'Missing user ID' });
    }

    // Aggregate purchase statistics
    const stats = await PurchaseHistory.aggregate([
      { $match: { memberId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          totalItems: { $sum: { $size: '$items' } }
        }
      }
    ]);

    console.log('Sending purchase statistics');
    res.status(200).json({
      message: 'Purchase statistics retrieved successfully',
      stats: stats[0] || {
        totalPurchases: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        totalItems: 0
      }
    });

  } catch (error) {
    console.error('Error fetching purchase statistics:', error);
    res.status(500).json({ error: 'Failed to fetch purchase statistics' });
  }
});

module.exports = router;