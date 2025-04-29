const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Add single product
router.post('/products', (req, res) => {
  const { name, description, price, image_url, category } = req.body;
  const stmt = db.prepare('INSERT INTO products (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)');
  stmt.run(name, description, price, image_url, category);
  res.json({ message: 'Product added successfully' });
});

// Bulk upload products
router.post('/upload', (req, res) => {
  const products = req.body.products || [];
  const stmt = db.prepare('INSERT INTO products (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)');
  const insertMany = db.transaction((products) => {
    for (const p of products) {
      stmt.run(p.name, p.description, p.price, p.image_url, p.category);
    }
  });

  insertMany(products);
  res.json({ message: 'Bulk upload successful' });
});

module.exports = router;
