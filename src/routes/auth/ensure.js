const loggedIn = (req, res, next) => {
  if (req.user) { next() } else { return res.status(401).send('not logged in') }
}

const isAdmin = (req, res, next) => {
  console.log('isAdmin?')
  console.log(req.user)
  if (req.user) {
    if (!req.user.isAdmin) {
      console.log('need admin access');
      return res.status(401).send('NO ACCESS. Admin only.')
    } else { next(); }
  } else { return res.status(401).send('not logged in') }
}

const adminOrCurrentUser = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (req.user) {
    console.log(req.user.id + req.user.username + req.user.isAdmin + ' admin status')
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