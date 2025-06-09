const mongoose = require('mongoose');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Load static product data
const products = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'product.json'), 'utf-8')
);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Database seeded with static product data!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error seeding the database:', err);
  });
