const pool = require('./pool');

//function that deletes the necessary tables on the database specified in the .env file in database_creation
const clearDatabase = async () => {
  const sql = 'DROP TABLE IF EXISTS "cart" CASCADE;\
  DROP TABLE IF EXISTS "orders" CASCADE;\
  DROP TABLE IF EXISTS "products" CASCADE;\
  DROP TABLE IF EXISTS "billing" CASCADE;\
  DROP TABLE IF EXISTS "delivery" CASCADE;\
  DROP TABLE IF EXISTS "vendors" CASCADE;\
  DROP TABLE IF EXISTS "users" CASCADE;\
  DROP TABLE IF EXISTS "contact" CASCADE;\
  DROP TABLE IF EXISTS "session" CASCADE;'
  //console.log(sql)
  await pool.query(sql)
}

module.exports = {
  clearDatabase
}