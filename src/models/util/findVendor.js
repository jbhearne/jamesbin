///////////////////////////////////////////////  
//Functions related to querying vendors table//

//import and create pool
const pool = require('./pool');

const { formatVendorOutput } = require('./formatOutput')

/** Gets a vendor using the vedor's ID
 * @param  {number}  id  [Vendor ID]
 * @return {object}      [A single vendor object with contact info]
*/
const findVendorById = async (id) => {
  const results = await pool.query('SELECT name, description, contact_id FROM vendors WHERE id = $1', [id]);
  const vendor = results.rows[0]
  const contact = await pool.query('SELECT * FROM contact WHERE id = $1', [vendor.contact_id])
  const vendorObj = {
    name: vendor.name,
    description: vendor.description,
    contact: contact.rows[0]
  }
  return vendorObj
}

const findAllVendors = async () => {
   results = await pool.query('SELECT * FROM vendors ORDER BY id ASC');
   return results.rows;
}

const addVendor = async (newVendor) => {
  const { name, description, contact } = newVendor;
  const { phone, address, city, state, zip, email } = contact;

  const contactSql = 'INSERT INTO contact (phone, address, city, state, zip, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';

  const contactRes = await pool.query(contactSql, [phone, address, city, state, zip, email]);

  const contactId = contactRes.rows[0].id;

  const vendorSql = 'INSERT INTO users (fullname, username, password, contact_id) VALUES ($1, $2, $3, $4) RETURNING *';
  
  const vendorRes = await pool.query(vendorSql, [name, description, contactId]);

  const vendorObj = vendorRes.rows[0];
  const contactObj = contactRes.rows[0];
  const vendor = formatVendorOutput(vendorObj, contactObj);

  return vendor;
};

const changeVendor = async (id, updates) => {
  const vendorObj = await findVendorById(id);

  if (updates.contact) {
    for (key in vendorObj.contact) {
      if (updates.contact[key]) { vendorObj.contact[key] = updates.contact[key] }
    }
  }

  for (key in vendorObj) {
    if (updates[key] && typeof updates[key] !== 'object') { vendorObj[key] = updates[key] }
  }

  const { name, description } = vendorObj;
  const vendorSql = 'UPDATE vendors SET name = $1, description = $2 WHERE id = $3 RETURNING *' 

  const vendor = await pool.query(vendorSql, [name, description, id]);

  const contactId = vendor.contact_id;
  const { phone, address, city, state, zip, email } = vendor.contact;
  const contactSql = 'UPDATE contact SET phone = $1, address = $2, city = $3, state = $4, zip = $5, email = $6 WHERE id = $7';

  const contact = await pool.query(contactSql, [phone, address, city, state, zip, email, contactId]);

  const updatedVendor = formatVendorOutput(vendor.rows[0], contact.rows[0]);
  return updatedVendor;
};

const removeVendor = async (id) => {
  const deletedVendor = await pool.query('DELETE FROM vendors WHERE id = $1 RETURNING *', [id]);
  const contactId = deletedVendor.contactId;
  const deletedContact = await pool.query('DELETE FROM contact WHERE id = $1', [contactId]);

  const deletedVendorObj = formatVendorOutput(deletedVendor, deletedContact);
  return deletedVendorObj;
}

module.exports = {
  findVendorById,
  findAllVendors,
  addVendor,
  changeVendor,
  removeVendor
}