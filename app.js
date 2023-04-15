//imports
require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

//create server
const app = express();
const PORT = process.env.PORT;

//middleware
app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//serve static react build
app.use(express.static(path.join(__dirname, 'src', 'view', 'build')));

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

//Get stripe object and add a route that gets the current cart total and uses that creat a paymentIntent, then sends the intent secret and the amount to crosscheck the value.
const stripe = require('stripe')(process.env.STRIPE_SECRET)

const { collectCart } = require('./src/models/findCart')
const { loggedIn } = require('./src/routes/auth/jwt-ensure')

app.get('/api/secret', (req, res, next) => {req.secTest = 'secTest'; next()}, (req, res, next) => {loggedIn(req, res, next)}, async (req, res) => {
  //testlog console.log('secret' + req.user.id)
  const cart = await collectCart(req.user.id);
  
  const intent = await stripe.paymentIntents.create({
    amount: parseInt(cart.total * 100),
    currency: 'usd',
    automatic_payment_methods: {enabled: true},
  });
  res.json({client_secret: intent.client_secret, amount: intent.amount});
}
);

//Use frontends routes to serve index.html
//const frontendRoutes = require('./frontend-routes')
//app.use(frontendRoutes);
//Home route
app.get('/*', (req, res) => { //TODO: add * and get rid of frontend routes, add a oops page to frontend.
  res.sendFile(path.join(__dirname, 'src', 'view', 'build', 'index.html'))
})

//start server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
    console.log(process.env.MY_SECRET)
    console.log(path.join(__dirname, 'src', 'view', 'build', 'index.html'))
  })