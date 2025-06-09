const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Product = require('../models/Product');
const User = require('../models/user');

// View all users and their favorites
router.get('/users', auth, admin, async (req, res) => {
  const users = await User.find().populate('favorites', 'name brand type');
  res.json(users);
});

// View all products
router.get('/products', auth, admin, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;