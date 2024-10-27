const mongoose = require('mongoose');

const cookieSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  }
}, { collection: 'cookie_shop' }); // Specify the collection name here

const Cookie = mongoose.model('Cookie', cookieSchema);

module.exports = Cookie;
