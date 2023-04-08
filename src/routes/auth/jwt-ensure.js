////////////////////////////////////////////////////////
/////route middleware used to check access status.////

const passport = require('passport')
const pool = require('../../models/util/pool')

//a function that when called as middleware, returns the passport.authenticate function using jwt stategy. used on all routes where being authenticated is needed.
const loggedIn = (req, res, next) => {
  return passport.authenticate('jwt', {session: false}, (err, user, info, status) => {
    //testlog console.log(info)
    //console.log('loggedInST' + req.secTest)
    //console.log('loggedInuser' + user.id)
    if (err) { return next(err) }
    if (!user) { 
      const information = Object.keys(info).length > 0 ? info : { message: 'Not logged in.'}; //FIXME not a good way to detect info. error messages not getting picked up as keys.
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

//checks if request.user.admin grants access to route if true.
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
  } else { return res.status(401).send('not logged in...') } 
}


//for use on order id parameter routes. checks if the user is admin or if the order belongs to the currrent user and allows access if so. 
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