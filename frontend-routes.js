const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'view', 'build', 'index.html'))
});
router.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'view', 'build', 'index.html'))
});
router.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'view', 'build', 'index.html'))
});
router.get('/vendors', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'view', 'build', 'index.html'))
});
router.get('/orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'view', 'build', 'index.html'))
});
router.get('/order/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'view', 'build', 'index.html'))
});
router.get('/order/complete', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'view', 'build', 'index.html'))
});
router.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'view', 'build', 'index.html'))
});
router.get('/user/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'view', 'build', 'index.html'))
});
router.get('/user/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'view', 'build', 'index.html'))
});
router.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'view', 'build', 'index.html'))
});

module.exports = router;