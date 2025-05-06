const express = require('express');
const router = express.Router();
const db = require('../models/db');


// Add a new product
router.post('/products', (req, res) => {
  const { name, description, price, image_url, category } = req.body;

  const stmt = db.prepare(`
    INSERT INTO products (name, description, price, image_url, category)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(name, description, price, image_url, category);
  res.json({ message: 'Product added successfully' });
});

// Bulk upload products (expects array of product objects)
router.post('/products/bulk', (req, res) => {
  const products = req.body;

  const stmt = db.prepare(`
    INSERT INTO products (name, description, price, image_url, category)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((products) => {
    for (const product of products) {
      stmt.run(product.name, product.description, product.price, product.image_url, product.category);
    }
  });

  insertMany(products);
  res.json({ message: 'Bulk upload successful' });
});

// ✨ Update (edit) a product
router.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, category } = req.body;

  const stmt = db.prepare(`
    UPDATE products
    SET name = ?, description = ?, price = ?, image_url = ?, category = ?
    WHERE id = ?
  `);

  stmt.run(name, description, price, image_url, category, id);
  res.json({ message: 'Product updated successfully' });
});

module.exports = router;
