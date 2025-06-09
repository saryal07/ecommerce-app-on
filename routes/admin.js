const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/admin');
const Product = require('../models/Product');
const User = require('../models/user');

// View all users and their favorites
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find()
      .populate('favorites', 'name brand type')
      .select('username email favorites'); // limit fields returned for privacy

    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// View all products (optional admin feature)
router.get('/products', auth, admin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
