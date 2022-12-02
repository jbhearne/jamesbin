const express = require('express');
const router = express.Router();
const { vendors } = require('../models/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure');

router.get('/vendors', vendors.getVendors);
router.post('/vendors', vendors.createVendor);
router.get('/vendors/:id', vendors.getVendorById);
router.put('/vendors/:id', vendors.updateVendor);
router.delete('/vendors/:id', vendors.deleteVendor);

module.exports = router;

