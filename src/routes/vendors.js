const express = require('express');
const router = express.Router();
const { vendors } = require('../api/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/jwt-ensure');

//routes related to vendor operations
router.get('/vendors', vendors.getVendors);
router.post('/vendors', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, vendors.createVendor);
router.get('/vendor/:id', vendors.getVendorById);
router.put('/vendor/:id', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, vendors.updateVendor);
router.delete('/vendor/:id', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, vendors.deleteVendor);

module.exports = router;

