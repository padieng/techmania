const express = require('express');
const router = express.Router();

let cart = [];

router.get('/', (req, res) => {
  res.json(cart);
});

router.post('/', (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId required' });

  const existing = cart.find(item => item.productId === parseInt(productId));
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId: parseInt(productId), quantity: 1 });
  }

  res.json({ message: 'Product added to cart' });
});

router.delete('/:productId', (req, res) => {
  cart = cart.filter(item => item.productId !== parseInt(req.params.productId));
  res.json({ message: 'Product removed from cart' });
});

router.post('/checkout', (req, res) => {
  cart = [];
  res.json({ message: 'Cart checked out successfully' });
});

module.exports = router;
