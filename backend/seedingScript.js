const Product = require('./models/product');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'));

const seedProducts = async () => {
  const products = [
    {
      name: 'Classic Dark Truffle',
      description: 'Rich dark chocolate truffle with a smooth center.',
      price: 15.99,
      image: '/images/dark-truffle.jpg',
    },
    // Add more products here
  ];
  await Product.insertMany(products);
  console.log('Products seeded');
  process.exit();
};

seedProducts();
