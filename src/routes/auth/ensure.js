////////////////////////////////////////////////////////
/////route middleware used to check access statues.////

const passport = require('passport')

//checks if the user is logged in
/*const loggedIn = (req, res, next) => {
  console.log('loggedIn')
  console.log(req.user)
  if (req.user) { next() } else { return res.status(401).send('not logged in') }
}*/

//IDEA creates a function that when called returns the authenticate function, this way I dont have to go back and add passport to all my routes.
const loggedIn = () => {
  
    return passport.authenticate('jwt', {session: false})
}
  

//check if the user has admin status
const isAdmin = (req, res, next) => {
  if (req.user) {
    if (!req.user.isAdmin) {
      console.log('need admin access');
      return res.status(401).send('NO ACCESS. Admin only.')
    } else { next(); }
  } else { return res.status(401).send('not logged in') }
}

//for use on user id parameter routes. checks if the user is admin or if the parameter is the currrent user
const adminOrCurrentUser = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (req.user) {
    if (!req.user.isAdmin) {
      if (req.user.id !== id) {
        return res.status(401).send('no access')
      } else { next() }
    } else { next() }
  } else { return res.status(401).send('not logged in') } 
}

/*const setJwtUser = (req, res, next) => {
  next(passport.authenticate('jwt', {session: false}))
}*/

module.exports = {
  loggedIn,
  isAdmin,
  adminOrCurrentUser
}