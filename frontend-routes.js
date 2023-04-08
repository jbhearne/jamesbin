const express = require('express');
const router = express.Router();
const path = require('path');


//Routes used by react router, so when directly nevigating index.html is served.
const reactPath = path.join(__dirname, 'src', 'view', 'build', 'index.html')

router.get('/products', (req, res) => {
  res.sendFile(reactPath)
});
router.get('/product/:id', (req, res) => {
  res.sendFile(reactPath)
});
router.get('/product/:id', (req, res) => {
  res.sendFile(reactPath)
});
router.get('/vendors', (req, res) => {
  res.sendFile(reactPath)
});
router.get('/orders', (req, res) => {
  res.sendFile(reactPath)
});
router.get('/order/checkout', (req, res) => {
  res.sendFile(reactPath)
});
router.get('/order/complete', (req, res) => {
  res.sendFile(reactPath)
});
router.get('/cart', (req, res) => {
  res.sendFile(reactPath)
});
router.get('/user/register', (req, res) => {
  res.sendFile(reactPath)
});
router.get('/user/login', (req, res) => {
  res.sendFile(reactPath)
});
router.get('/user', (req, res) => {
  res.sendFile(reactPath)
});

module.exports = router;