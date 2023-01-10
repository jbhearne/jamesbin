////////////////////////////////////////////////////////
/////route middleware used to check access statues.////

//checks if the user is logged in
const loggedIn = (req, res, next) => {
  if (req.user) { next() } else { return res.status(401).send('not logged in') }
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

module.exports = {
  loggedIn,
  isAdmin,
  adminOrCurrentUser
}