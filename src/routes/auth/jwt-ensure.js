////////////////////////////////////////////////////////
/////route middleware used to check access statues.////

const passport = require('passport')
const pool = require('../../models/util/pool')

//IDEA creates a function that when called returns the authenticate function, this way I dont have to go back and add passport to all my routes.
const loggedIn = (req, res, next) => {
  return passport.authenticate('jwt', {session: false}, (err, user, info, status) => {
    if (err) { return next(err) }
    if (!user) { 
      const information = Object.keys(info).length > 0 ? info : { message: 'Not logged in.'};
      return res.status(404).json({ 
        info: information,
        auth: false,
        status: status,
      });
    }
    req.user = user;
    next();
  })(req, res, next);
}
  
const isAdmin = (req, res, next) => {
  if (req.user) {
    if (!req.user.admin) {
      console.log('need admin access');
      return res.status(401).send('NO ACCESS. Admin only.')
    } else { next(); }
  } else { return res.status(401).send('not logged in') }
}

//for use on user id parameter routes. checks if the user is admin or if the parameter is the currrent user
const adminOrCurrentUser = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (req.user) {
    if (!req.user.admin) {
      if (req.user.id !== id) {
        return res.status(401).send('no access')
      } else { next() }
    } else { next() }
  } else { return res.status(401).send('not logged in') } 
}


//CHANGED add new authoriztion
const adminOrUserOrder = (req, res, next) => {
  const orderId = parseInt(req.params.id);
  const sql = 'SELECT * FROM orders WHERE id = $1'
  pool.query(sql, [orderId], (err, results) => {
    if (!results.rows[0]) {
      return res.status(401).send('no order found')
    }
    const order = results.rows[0];
    if (req.user) {
      if (!req.user.admin) {
        if (req.user.id !== order.user_id) {
          return res.status(401).send('no access')
        } else { next() }
      } else { next() }
    } else { return res.status(401).send('not logged in') } 
  }) 
}


module.exports = {
  loggedIn,
  isAdmin,
  adminOrCurrentUser,
  adminOrUserOrder,
}