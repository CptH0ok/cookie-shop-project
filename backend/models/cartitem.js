const mongoose = require('mongoose');
const Cookie = require('./cookie');  // Reference to Cookie model

const cartItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      cookie: { type: mongoose.Schema.Types.ObjectId, ref: 'Cookie', required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ]
}, { collection: 'cart' });

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;

