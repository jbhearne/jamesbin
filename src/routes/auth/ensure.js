const loggedIn = (req, res, next) => {
  if (!req.user.id) {
    console.log('access denied')
    return res.status(401).send('NO ACCESS')
  } 
  next();
}

const admin = (req, res, next) => {
  if (!req.user.admin) {
    console.log('need admin access');
    return res.status(401).send('NO ACCESS. Admin only.')
  }
  next();
}

const adminOrCurrentUser = (req, id) => {
  if (!req.user.admin) {
    if (req.user.id !== id) {
      return response.status(401).send('no access')
    }
  }
}

module.exports = {
  loggedIn,
  admin,
  adminOrCurrentUser
}