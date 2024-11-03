// api/cartItems.js
import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  name: String,
  size: String,
  price: Number,
  quantity: Number,
  image: String,
  userId: String, // to associate cart with specific users
});

export const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', CartItemSchema);

// API route handler - api/routes/cart.js
import { CartItem } from '../models/CartItem';

export async function getCartItems(userId) {
  try {
    const items = await CartItem.find({ userId });
    return items;
  } catch (error) {
    throw new Error('Failed to fetch cart items');
  }
}

export async function updateCartItem(itemId, updates) {
  try {
    const item = await CartItem.findByIdAndUpdate(
      itemId,
      updates,
      { new: true }
    );
    return item;
  } catch (error) {
    throw new Error('Failed to update cart item');
  }
}

export async function removeCartItem(itemId) {
  try {
    await CartItem.findByIdAndDelete(itemId);
    return { success: true };
  } catch (error) {
    throw new Error('Failed to remove cart item');
  }
}