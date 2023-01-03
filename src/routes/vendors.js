const express = require('express');
const router = express.Router();
const { vendors } = require('../api/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure');

//routes related to vendor operations
router.get('/vendors', vendors.getVendors);
router.post('/vendors', isAdmin, vendors.createVendor);
router.get('/vendors/:id', vendors.getVendorById);
router.put('/vendors/:id', isAdmin, vendors.updateVendor);
router.delete('/vendors/:id', isAdmin, vendors.deleteVendor);

module.exports = router;

