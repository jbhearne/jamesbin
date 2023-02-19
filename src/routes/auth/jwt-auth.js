const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../../models/util/pool');
const bcrypt = require('bcrypt');
const { addUser } = require('../../models/findUser');
const router = express.Router();
const { loggedIn } = require('./ensure')

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const jsonwebtoken = require('jsonwebtoken');

//checks to see if username and password are in the database abd uses bcrypt.compare to rehash password.
/*passport.use(new LocalStrategy((username, password, cb) => {
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
    console.log(res.rows[0])
    return cb(null, res.rows[0]);
  })
}))*/

//IDEA: start of JWT authentication strategy
const pathToPubKey = path.join(__dirname, '../../../', 'public.pem')//'../../../../public.pem';
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
}

passport.use(new JwtStrategy(options, (jwt_payload, done) => {
  const id = jwt_payload.sub;
  //REVIEW this will end up querying the database everytime passport.authenticate is called.
  //REVIEW i think you could change this so that you could save more user info in the JWT and then extract that and 
  //REVIEW then call done() using the extracted info which i think puts sets the req.user object.
  //REVIEW this was cited as a benifit of JWT, but it would mean that you are actual not checking the database, which could be less secure 
  //REVIEW and also could cause problems if there were changes to the database that were not synced to the JWT being used.
  //REVIEW maybe using multiple strategies would be best. like passport.authenticate on some routes and custom authentication on others.
  const sql = 'SELECT * FROM users WHERE id = $1'; 
  pool.query(sql, [id], async (err, res) => {
    if (err) { return done(err, false) }
    if (res.rows[0]) {
      return done(null, res.rows[0]);
    } else {
      return done(null, false);
    }
  });
}))


//IDEA issue JWT, this should go in another file
const pathToPrvKey = path.join(__dirname, '../../../', 'private.pem')//'../../../../private.pem';
const PRV_KEY = fs.readFileSync(pathToPrvKey, 'utf8');

const issueJWT = (user) => {
  const id = user.id;
  const expiresIn = 24 * 60 * 60 * 1000;

  const payload = {
    sub: id,
    iat: Date.now(),
  }

  const signedToken = jsonwebtoken.sign(payload, PRV_KEY, {
    expiresIn: expiresIn,
    algorithm: 'RS256',
  });

  return {
    token: 'Bearer ' + signedToken,
    expiresIn: expiresIn,
  }
}

//save user object with specified data, stores the data in non-human readable form 
/*passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, isAdmin: user.admin });
  });
});

//decodes the user object and injects it into the request object.
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});*/

//placeholder route for a login page
router.get('/login', function(req, res, next) {
  res.send('login');
});

//route used to login. a request body with username and password expected.
/*router.post('/login', (req, res, next) => {console.log(req.body); next()}, passport.authenticate('local', {
  //successRedirect: '/',
  failureRedirect: '/login'
}), (req, res) => {
  res.send(req.user)
});*/


//IDEA new login route for JWT
router.post('/login', (req, res, next) => {console.log(req.body); next()}, async (req, res, next) => {
  const sql = 'SELECT * FROM users WHERE username = $1';
  pool.query(sql, [req.body.username], async (err, results) => {
    const user = results.rows[0]
    if (err) { res.status(401).json({ success: false, msg: "error" }); }
    if (!user) {
      res.status(401).json({ success: false, msg: "could not find user" });
    } 
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    if (isValidPassword) {
      const tokenObject = issueJWT(user);
      res.status(200).json({
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

//IDEA testing default authenicate route 
router.get('/authenticate', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  console.log(req.user)
  res.status(200).json({
    user: req.user,
    success: true,
    msg: 'authenticated',
  })
})

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

router.put('/user/password', loggedIn, async (req, res, next) => {
  const { password } = req.body;
  const userId = req.user.id;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const sql = 'UPDATE users SET password = $1 WHERE id = $2'
  pool.query(sql, [hash, userId], (error, results) => {
    if (error) { next(error) };
    res.status(200).send('Password updated.')
  })
})

module.exports = router