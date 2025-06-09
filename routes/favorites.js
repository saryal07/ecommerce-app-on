const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const User = require('../models/user');

// ✅ 1. Used by frontend to fetch products by array of IDs
router.post('/products/favorites', async (req, res) => {
  const { ids } = req.body;
  const products = await Product.find({ _id: { $in: ids } });
  res.json({ products });
});

// 2. Add favorite
router.post('/:id', auth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const user = await User.findById(req.user.id);
  if (!user.favorites.includes(product._id)) {
    user.favorites.push(product._id);
    await user.save();
  }

  res.status(200).json({ message: 'Favorited', favorites: user.favorites });
});

// 3. Remove favorite
router.delete('/:id', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.favorites = user.favorites.filter(fav => fav.toString() !== req.params.id);
  await user.save();
  res.status(200).json({ message: 'Removed', favorites: user.favorites });
});

// 4. Get all favorites of current user
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate('favorites');
  res.status(200).json({ favorites: user.favorites });
});

module.exports = router;