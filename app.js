require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)



app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
    console.log(process.env.MY_SECRET)
  })