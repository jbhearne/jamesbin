//imports
require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport');
const { sessionConfig, session } = require('./src/models/util/sessionConfig');
const cors = require('cors')

//create server
const app = express()
const PORT = process.env.PORT

//middleware
app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//start session and passport
app.use(passport.initialize())
app.use(session(sessionConfig))
app.use(passport.session());
app.use(passport.authenticate('session'));

//import and use authentication routes
const authRouter = require('./src/routes/auth/auth');
app.use('/', authRouter);

//import and use app routes
const routes = require('./src/routes/index')
app.use(routes.userRoutes);
app.use(routes.orderRoutes);
app.use(routes.vendorRoutes);
app.use(routes.productRoutes);
app.use(routes.cartRoutes);

//Home route
app.get('/', (req, res) => {
  res.send('home')
})

//start server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
    console.log(process.env.MY_SECRET)
  })