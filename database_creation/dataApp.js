//imports
require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport');
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

app.use(passport.initialize())


//Home route
app.get('/', (req, res) => {
  res.send('home')
})

//start server
app.listen(PORT, async () => {
    console.log(`App running on port ${PORT}.`)
    console.log(process.env.MY_SECRET)
    console.log(process.env.DATABASE)
    
    //Clears out the database that may have already been created.
    await clearDatabase();
    //Creates or recreates the database for the project.
    await createDatabase();

    //Comment out the next two lines if you do not want to prepopulate the database with some starting rows.
    await popDatabase();
    await popPasswords('password', 10);
  })