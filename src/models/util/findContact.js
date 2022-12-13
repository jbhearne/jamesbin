///////////////////////////////////////////////  
//Functions related to querying contact table//

//import and create pool
const pool = require('./pool');

//REVIEW: created to help with contact info related to checkout, but probably should be used elsewhere too.
//Creats a new contact using a conact object. Returns the new contact.
const addContactInfo = async (contactObj) => {
  const { phone, address, city, state, zip, email } = contactObj;
  const sql = 'INSERT INTO contact (phone, address, city, state, zip, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  
  const results = await pool.query(sql, [phone, address, city, state, zip, email]);
  
  return results.rows[0]
}

//changes an existing contact using a contact object (updates). returns the updated contact object.
const updateContactInfo = async (updates, contactId) => {
  selectSql = 'SELECT * FROM contact WEHERE id = $1'

  const selectRes = await pool.query(selectSql, [contactId]);
  
  const contact = selectRes.rows[0]
  for (key in contact) {
    if (updates[key]) { contact[key] = updates[key] }
  }
  
  const { phone, address, city, state, zip, email } = contact;
  const updateSql = 'UPDATE contact SET phone = $1, address = $2, city = $3, state = $4, zip = $5, email = $6 WHERE id = $7 RETURNING *';

  const results = await pool.query(updateSql, [phone, address, city, state, zip, email, contactId]);

  return results.rows[0]
}

module.exports = {
  addContactInfo,
  updateContactInfo
}