//////////////////////////////////////////////
//an authentication scheme based on JWTs


//imports
const express = require('express');
const passport = require('passport');
const router = express.Router();
const validate = require('./validate');
const pool = require('../../models/util/pool');
const bcrypt = require('bcrypt');
//GARBAGE const JwtStrategy = require('passport-jwt').Strategy;
//GARBAGE const ExtractJwt = require('passport-jwt').ExtractJwt;
//GARBAGE const fs = require('fs');
const { initJWT, issueJWT } = require('./async_passport')
const path = require('path');
const jsonwebtoken = require('jsonwebtoken');
const { addUser } = require('../../models/findUser');
const { loggedIn } = require('./jwt-ensure')

//initiates passport JWT strategy
initJWT();

//placeholder route for a login page
router.get('/login', function(req, res, next) {
  res.send('login');
});

//login route for JWT. finds the username and compares the hashed password. If valid, it issues a JWT and sends an object: {msg, success, token, expiresIn}
//request body = { username, password }
router.post('/login', async (req, res, next) => {
  const sql = 'SELECT * FROM users WHERE username = $1';
  pool.query(sql, [req.body.username], async (err, results) => {
    const user = results.rows[0]
    if (err) { res.status(401).json({ success: false, msg: "error" }); }
    if (!!!user?.password) {
      return res.status(401).json({ success: false, msg: "could not find user" });
    } 
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    if (isValidPassword) {
      const tokenObject = await issueJWT(user); //CHANGED - now importing this from module as async, added await keyword
      res.status(200).json({
        msg: 'logged in',
        success: true,
        token: tokenObject.token,
        expiresIn: tokenObject.expiresIn,
      });
    } else {
      res
          .status(401)
          .json({ success: false, msg: "you entered the wrong password" });
    }
  })
});

//route to create a new user, checks if there is already a username in the database, uses bcrypt to salt and hash password before adding it to the database.
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body
  
  pool.query('SELECT * FROM users WHERE username = $1', [username], async (error, results) => {
    if (error) { next(error) }
    const rows = await results.rows;
    if (rows.length > 0) {
      console.log('User already exists.')
      return res.status(400).json({ msg: 'User already exists.', success: false })
    }

    const validPassword = validate.password(password, { min: 3, include: ',.', exclude: 'a' })

    if (!validPassword.isValid) {
      return res.status(400).json({ msg: validPassword.msg, success: false })
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    req.body.password = hash;
    const user = await addUser(req.body);
    console.log(`created user${await req.body.id}`)
    res.status(200).json({ msg: 'user registed', success: true, user: user })
  })
})

//route to update password.
router.put('/user/password', (req, res, next) => {loggedIn(req, res, next)}, async (req, res, next) => {
  const { password } = req.body;
  const userId = req.user.id;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const sql = 'UPDATE users SET password = $1 WHERE id = $2';
  pool.query(sql, [hash, userId], (error, results) => {
    if (error) { next(error) };
    res.status(200).json({ msg: 'Password updated.', success: true })
  })
})

module.exports = router