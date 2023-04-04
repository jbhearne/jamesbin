//imports
require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
//GARBAGE const { sessionConfig, session } = require('./src/models/util/sessionConfig');
const cors = require('cors');
const path = require('path');
//GARBAGE const session = require('express-session');
//GARBAGE const pgSession = require('connect-pg-simple')(session);
//GARBAGE const randomString = require('randomstring')
//const pool = require('./src/models/util/pool');


//create server
const app = express();
const PORT = process.env.PORT;

//middleware
//app.use(cors({credentials: true, origin: ['http://api.app.localhost:3002', 'http://localhost:3000']}))
/*var corsOptions = {
  origin: ["http://localhost:3002", "http://localhost:3000", "https://checkout.stripe.com"],
}*/
app.use(cors())
/*app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', ['http://api.app.localhost:3002']);
  next();
});*/
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(express.static(path.join(__dirname, 'src', 'view', 'build')));

//start session and passport
//app.use(passport.initialize()) //??? makes sure passport is available on all routes
//GARBAGE app.use(session(sessionConfig)) //configures the session, cookie and asigns a store (database) for serialized session info.
//GARBAGE app.use(passport.session()); //creates a session, adds set cookie to responses with serialized session info.
//GARBAGE app.use(passport.authenticate('session')); //deserializes session info from cookie sent from browser, validates user info and adds user object to request object on every route. It is up to the programmer how this info is used to control access.

//import and use authentication routes
const authRouter = require('./src/routes/auth/jwt-auth');
app.use('/api', authRouter);


//import and use app routes
const routes = require('./src/routes/index')
app.use('/api', routes.userRoutes);
app.use('/api', routes.orderRoutes);
app.use('/api', routes.vendorRoutes);
app.use('/api', routes.productRoutes);
app.use('/api', routes.cartRoutes);

const stripe = require('stripe')(process.env.STRIPE_SECRET)

const { collectCart } = require('./src/models/findCart')
const { loggedIn } = require('./src/routes/auth/jwt-ensure')
app.get('/secret', (req, res, next) => {req.secTest = 'secTest'; next()}, (req, res, next) => {loggedIn(req, res, next)}, async (req, res) => {
  console.log('secret' + req.user.id)
  const cart = await collectCart(req.user.id);
  
  const intent = await stripe.paymentIntents.create({
    amount: parseInt(cart.total * 100),
    currency: 'usd',
    automatic_payment_methods: {enabled: true},
  });
  res.json({client_secret: intent.client_secret, amount: intent.amount});
}
);


/*app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3002/complete',
    cancel_url: 'http://localhost:3002/checkout',
  });
  console.log(session)
  res.set("Sec-Fetch-Dest", "document")
  res.set("Sec-Fetch-Mode", "no-cors")
  res.redirect(303, session.url);
});*/

//Home route
app.get('/', (req, res) => {
  res.sendFile(path.join((__dirname, 'src', 'view', 'build', 'index.html')))
})

//start server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
    console.log(process.env.MY_SECRET)
  })