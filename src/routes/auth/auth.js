const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../../models/util/pool');
const bcrypt = require('bcrypt');
const { addUser } = require('../../models/util/findUser');
const router = express.Router();

//checks to see if username and password are in the database abd uses bcrypt.compare to rehash password.
passport.use(new LocalStrategy((username, password, cb) => {
  console.log('is local running?'); 
  pool.query('SELECT * FROM users WHERE username = $1', [ username ], async (err, res) => {
    console.log('is pool running?')
    if (err) {
      return cb(err); 
    }
    if (!res.rows[0]) { 
      return cb(null, false, { message: 'Incorrect username or password.' }); 
    }
    const correctPassword = await bcrypt.compare(password, res.rows[0].password);
    if (!correctPassword) {
      return cb(null, false, { message: 'Incorrect username or password.' })
    }
    return cb(null, res.rows[0]);
  })
}))

//save user object with specified data, stores the data in non-human readable form 
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, isAdmin: user.admin });
  });
});

//decodes the user object and injects it into the request object.
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

//placeholder route for a login page
router.get('/login', function(req, res, next) {
  res.send('login');
});

//route used to login. a request body with username and password expected.
router.post('/login/password', (req, res, next) => {console.log('howdy'); next()}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

//route to logout
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//placeholder route for a registration page
router.get('/register', function(req, res, next) {
  res.send('register');
});

//route to create a new user, checks if there is already a username in the database, uses bcrypt to salt and hash password before adding it to the database.
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body
  
  pool.query('SELECT * FROM users WHERE username = $1', [username], async (error, results) => {
    if (error) { next(error) }
    const rows = await results.rows;
    if (rows.length > 0) {
      console.log('User already exists.')
      return res.send('User already exists.')
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    req.body.password = hash;
    await addUser(req.body);
    console.log(`created user${await req.body.id}`)
    res.redirect('/login')
  })
})

module.exports = router