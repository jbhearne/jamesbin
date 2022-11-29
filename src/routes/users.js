const express = require('express');
const router = express.Router();
const { users } = require('../models/index');

router.get('/users', users.getUsers);
router.post('/users', users.createUser);
router.get('/users/:id', users.getUserById);
router.put('/users/:id', users.updateUser);
router.delete('/users/:id', users.deleteUser);

module.exports = router;