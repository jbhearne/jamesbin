//////////////////////////////////////////////////////
//Creates a pool that is used to access the database//

require('dotenv/config')
const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  max: 5, // set pool max size
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  //connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
  //port: process.env.DB_PORT
})

module.exports = pool;