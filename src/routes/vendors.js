const express = require('express');
const router = express.Router();
const { vendors } = require('../api/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure');

//routes related to vendor operations
router.get('/vendors', vendors.getVendors);
router.post('/vendors', isAdmin, vendors.createVendor);
router.get('/vendor/:id', vendors.getVendorById);
router.put('/vendor/:id', isAdmin, vendors.updateVendor);
router.delete('/vendor/:id', isAdmin, vendors.deleteVendor);

module.exports = router;

