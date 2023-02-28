const express = require('express');
const router = express.Router();
const { orders, cart } = require('../api/index');
const { loggedIn, isAdmin, adminOrCurrentUser, adminOrUserOrder } = require('./auth/jwt-ensure');

//routes for handling orders and checkout
router.get('/orders', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, orders.getOrders);
router.post('/orders', (req, res, next) => {loggedIn(req, res, next)}, orders.createOrder); 
router.get('/orders/:id', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, orders.getOrderById);
router.put('/orders/:id', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, orders.updateOrder);
router.delete('/orders/:id',  (req, res, next) => {loggedIn(req, res, next)}, isAdmin, orders.deleteOrder);
router.get('/orders/user/:id', (req, res, next) => {loggedIn(req, res, next)}, adminOrCurrentUser, orders.getOrdersByUser); 
router.get('/checkout', (req, res, next) => {loggedIn(req, res, next)}, cart.getCartForCheckout); 
router.post('/checkout', (req, res, next) => {loggedIn(req, res, next)}, orders.checkout);
router.get('/cart/order/:id', (req, res, next) => {loggedIn(req, res, next)}, adminOrUserOrder, orders.getItemsByOrderId); //CHANGED add this route

module.exports = router;