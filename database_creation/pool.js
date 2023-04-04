//////////////////////////////////////////////////////
//Creates a pool that is used to access the database//

require('dotenv/config')
const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
})

module.exports = pool;