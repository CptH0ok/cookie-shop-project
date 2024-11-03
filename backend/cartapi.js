import express from 'express';
import { CartItem } from '../models/cartitem.js';

const router = express.Router();

// Add an item to the cart
router.post('/add', async (req, res) => {
  try {
    const { userId, productId, name, size, price, quantity, image } = req.body;
    const cartItem = new CartItem({ userId, productId, name, size, price, quantity, image });
    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

// Get items in the cart
router.get('/:userId', async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.params.userId });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart items' });
  }
});

export default router;
