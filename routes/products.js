const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// GET /products?page=1&brand=Brand1;Brand2&type=Type1;Type2
router.get('/', async (req, res) => {
  const { page = 1, brand, type } = req.query;
  const PAGE_SIZE = 9;
  const filters = {};

  if (brand) {
    filters.brand = { $in: brand.split(';') };
  }
  if (type) {
    filters.type = { $in: type.split(';') };
  }

  try {
    const total = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);
    res.status(200).json({ products, totalPages: Math.ceil(total / PAGE_SIZE) });
  } catch (err) {
    res.status(422).json({ error: 'Invalid filters or request' });
  }
});

router.get('/products', async (req, res) => {
  const { page = 1, brands, types } = req.query;

  const filter = {};
  if (brands) filter.brand = { $in: brands.split(',') };
  if (types) filter.type = { $in: types.split(',') };

  const limit = 10;
  const skip = (page - 1) * limit;

  const products = await Product.find(filter).skip(skip).limit(limit);
  const total = await Product.countDocuments(filter);

  res.json({ products, total });
});


// GET /products/details/:id
router.get('/details/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(422).json({ error: 'Invalid product ID format' });

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  res.status(200).json({ product });
});

// GET /api/products/filters
router.get('/filters', async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    const types = await Product.distinct('type');
    res.json({ brands, types });
  } catch (error) {
    console.error('Failed to fetch filters:', error);
    res.status(500).json({ error: 'Failed to load filters' });
  }
});

module.exports = router;