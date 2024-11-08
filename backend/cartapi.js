const express = require('express');
const router = express.Router();
const CartItem = require('./models/Cartitem');
const User = require('./models/user');
const Cookie = require('./models/cookie'); 
const { authenticateJWT } = require('./middlewares');
const mongoose = require('mongoose');

// Add an item to the cart
router.post('/add', authenticateJWT, async (req, res) => {
  const { userId, cookieId, quantity } = req.body;

  console.log('Add item start:', { userId, cookieId, quantity });

  try {
    // Validate input
    if (!userId || !cookieId || !quantity || typeof quantity !== 'number' || quantity <= 0) {
      console.log('Missing or invalid required fields');
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    // Ensure cookieId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(cookieId)) {
      console.log('Invalid cookieId');
      return res.status(400).json({ error: 'Invalid cookieId format' });
    }
    const cookieIdObject = new mongoose.Types.ObjectId(cookieId);

    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Find or create the user's cart
    console.log('Finding or creating user cart');
    let cart = await CartItem.findOne({ user: userId });
    if (!cart) {
      console.log('Creating new cart for user');
      cart = new CartItem({ user: userId, items: [] });
    }

    // Check if the item already exists in the cart using string comparison
    console.log('Checking if item already exists in cart');
    const existingItemIndex = cart.items.findIndex(
      item => item.cookie.toString() === cookieIdObject.toString()
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      console.log('Updating existing item quantity');
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      console.log('Adding new item to cart');
      cart.items.push({ cookie: cookieIdObject, quantity });
    }

    // Save the updated cart
    console.log('Saving updated cart');
    await cart.save();

    // Fetch the populated cart to return
    const populatedCart = await CartItem.findOne({ user: userId })
      .populate('items.cookie', 'name price imageUrl')
      .exec();

    res.status(200).json({ message: 'Item added to cart', items: populatedCart.items });
  } catch (error) {
    console.error('Error adding to cart:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Remove an item from the cart
router.delete('/remove', authenticateJWT, async (req, res) => {
  const { userId, cookieId } = req.body;

  console.log('Remove item start:', { userId, cookieId });

  try {
    // Validate input
    if (!userId || !cookieId) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the user's cart
    console.log('Finding user cart');
    let cart = await CartItem.findOne({ user: userId });
    if (!cart) {
      console.log('Cart not found');
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Check if the item exists in the cart
    const itemIndex = cart.items.findIndex(item => item.cookie === cookieId);
    if (itemIndex === -1) {
      console.log('Item not found in cart');
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Remove the item from the cart
    console.log('Removing item from cart');
    cart.items.splice(itemIndex, 1);
    await cart.save();

    // Return the updated cart
    const updatedCart = await CartItem.findOne({ user: userId })
      .populate('items.cookie', 'name price imageUrl')
      .exec();

    res.status(200).json({ message: 'Item removed from cart', items: updatedCart.items });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});


// Get user cart items
router.get('/:userId', authenticateJWT, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the cart and populate the 'cookie' field
    const cart = await CartItem.findOne({ user: userId })
      .populate('items.cookie', 'name price imageUrl')
      .exec();

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
