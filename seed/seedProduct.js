// seed.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const brands = ['Himalayan', 'Everest', 'Gorkha', 'Pashmina', 'Namaste'];
const types = ['Clothing', 'Accessories', 'Home'];

const generateProducts = () => {
  const products = [];
  for (let i = 0; i < 30; i++) {
    const brand = brands[i % brands.length];
    const type = types[i % types.length];
    products.push({
      name: `${brand} Product ${i + 1}`,
      brand,
      type,
      image: `https://picsum.photos/seed/product${i + 1}/300/300`, // Dynamic image
      price: Math.floor(Math.random() * 100 + 10),
      description: `High-quality ${type} from ${brand}.`
    });
  }
  return products;
};

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
    await Product.deleteMany();
    await Product.insertMany(generateProducts());
    console.log('Database seeded with 30 products!');
    mongoose.disconnect();
}).catch(err => {
    console.error('Error seeding the database:', err);
});