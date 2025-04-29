const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all products
router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

// GET one product by ID
router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

module.exports = router;
