///////////////////////////////////////////////////////////////////////////////
///Router for routes related to products

//imports
const express = require('express');
const router = express.Router();
const { users } = require('../api/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/jwt-ensure')

//routes related to user
router.get('/user', (req, res, next) => {loggedIn(req, res, next)}, (req, res, next) => {console.log(req.user); next()}, users.getCurrentUser); //DONE - //CHANGED added this route to get current logged in user
router.get('/users', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, users.getUsers);
router.get('/user/:id', (req, res, next) => {loggedIn(req, res, next)}, adminOrCurrentUser, users.getUserById);
router.put('/user/:id', (req, res, next) => {loggedIn(req, res, next)}, adminOrCurrentUser, users.updateUser); //DONE - 
router.delete('/user/:id', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, users.deleteUser);

module.exports = router;