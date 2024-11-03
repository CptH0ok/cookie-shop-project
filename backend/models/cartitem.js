const mongoose = require('mongoose');;

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'cookie', required: true },
  name: String,
  size: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  image: String,
}, { collection: 'cookie_shop' }); 


module.exports = mongoose.model('CartItem', cartItemSchema);
