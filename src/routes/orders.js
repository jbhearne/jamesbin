const express = require('express');
const router = express.Router();
const { orders } = require('../models/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure');

router.get('/orders', orders.getOrders);
router.post('/orders', orders.createOrder);
router.get('/orders/:id', orders.getOrderById);
router.put('/orders/:id', orders.updateOrder);
router.delete('/orders/:id', orders.deleteOrder);
//must decide how this works. is it thru the route or is it thru authorization?
router.get('/orders/user/:id', orders.getOrdersByUser);

module.exports = router;