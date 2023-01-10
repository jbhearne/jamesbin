//imports
require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport');
//const { sessionConfig, session } = require('../src/models/util/sessionConfig')
const { popPasswords } = require('./populate/hashmake')
const { createDatabase } = require('./create_database')
const { clearDatabase } = require('./clear_database')
const { popDatabase } = require('./populate/populate')

//create server
const app = express()
const PORT = process.env.PORT

//middleware
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//start session and passport
app.use(passport.initialize())
//app.use(session(sessionConfi

//app.use(passport.authenticate('session'));

//Home route
app.get('/', (req, res) => {
  res.send('home')
})

//start server
app.listen(PORT, async () => {
    console.log(`App running on port ${PORT}.`)
    console.log(process.env.MY_SECRET)
    console.log(process.env.DATABASE)
    await clearDatabase();
    await createDatabase();
    await popDatabase();
    await popPasswords('password', 10);
  })