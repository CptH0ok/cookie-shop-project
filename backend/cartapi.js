const express = require('express');
const router = express.Router();
const CartItem = require('./models/Cartitem');
const User = require('./models/user');
const Cookie = require('./models/cookie'); 
const { authenticateJWT } = require('./middlewares');
const mongoose = require('mongoose');

router.post('/add', authenticateJWT, async (req, res) => {
  const { userId, cookieId, quantity } = req.body;

  console.log('Add item start:', { userId, cookieId, quantity });

  try {
    // Validate input
    if (!userId || !cookieId || quantity === undefined) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find the cart
    let cart = await CartItem.findOne({ user: userId });
    if (!cart) {
      cart = new CartItem({ user: userId, items: [] });
    }

    // Find the existing item in the cart
    const existingItemIndex = cart.items.findIndex(
      item => item.cookie.toString() === cookieId.toString()
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity <= 0) {
        // Remove item if quantity becomes 0 or negative
        cart.items.splice(existingItemIndex, 1);
      } else {
        // Update quantity if it's still positive
        cart.items[existingItemIndex].quantity = newQuantity;
      }
    } else if (quantity > 0) {
      // Only add new item if quantity is positive
      cart.items.push({ 
        cookie: cookieId,
        quantity: quantity 
      });
    }

    // Save the updated cart
    await cart.save();

    // Fetch and return the updated cart
    const updatedCart = await CartItem.findOne({ user: userId })
      .populate({
        path: 'items.cookie',
        model: 'Cookie',
        collection: 'cookie_shop'
      })
      .exec();

    res.status(200).json({ 
      message: 'Cart updated successfully',
      cart: updatedCart
    });

  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.delete('/remove', authenticateJWT, async (req, res) => {
  try {
    const { userId, cookieId, version } = req.body;
    console.log('Remove request:', { userId, cookieId, version });

    // Validate input
    if (!userId || !cookieId || version === undefined) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find the cart and remove the item
    const cart = await CartItem.findOneAndUpdate(
      { user: userId, 'items.cookie': cookieId },
      { $pull: { items: { cookie: cookieId } }, $inc: { version: 1 } },
      { new: true, runValidators: true }
    );

    if (!cart) {
      console.log('Cart not found');
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Fetch the updated cart with populated items
    const updatedCart = await CartItem.findOne({ user: userId })
      .populate({
        path: 'items.cookie',
        model: 'Cookie',
        collection: 'cookie_shop'
      })
      .exec();

    console.log('Sending updated cart');
    res.status(200).json({ 
      message: 'Item removed successfully',
      cart: updatedCart
    });

  } catch (error) {
    if (error.name === 'VersionError') {
      console.error('Version error when removing item from cart:', error);
      return res.status(409).json({ error: 'Version conflict, please refresh and try again' });
    }

    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

router.get('/:userId', authenticateJWT, async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching cart for user:', userId);

    // First get the cart
    let cart = await CartItem.findOne({ user: userId });
    
    if (!cart) {
      console.log('No cart found, creating new cart for user:', userId);
      cart = new CartItem({ 
        user: userId, 
        items: [],
        version: 0  // Initialize version
      });
      await cart.save();
      return res.status(200).json({ cart: { ...cart.toObject(), items: [] } });
    }

    console.log('Found cart:', JSON.stringify(cart, null, 2));

    // Get all cookies
    const cookies = await Cookie.find({}).lean();
    console.log('Found cookies:', cookies.length);

    // Map cart items with cookie data
    const populatedItems = cart.items.map(item => {
      const cookie = cookies.find(c => c._id.toString() === item.cookie.toString());
      console.log('Matching cookie for item:', {
        cartCookieId: item.cookie.toString(),
        foundCookie: cookie ? cookie.name : 'not found'
      });

      if (!cookie) return null;

      return {
        _id: item._id,
        quantity: item.quantity,
        cookie: {
          _id: cookie._id,
          id: cookie.id,
          name: cookie.name,
          price: cookie.price,
          imageUrl: cookie.imageUrl,
          description: cookie.description,
          category: cookie.category,
          available: cookie.available
        }
      };
    }).filter(item => item !== null);

    // Create the final cart object - Include version here
    const populatedCart = {
      _id: cart._id,
      user: cart.user,
      items: populatedItems,
      version: cart.version || 0,  // Include version in response
      __v: cart.__v
    };

    console.log('Final populated items:', populatedCart.items.length);
    console.log('Cart version:', populatedCart.version); // Debug log
    res.status(200).json({ cart: populatedCart });

  } catch (error) {
    console.error('Error fetching cart items:', error);
    console.error('Error details:', error.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
