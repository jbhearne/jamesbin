///////////////////////////////////////////////  
//Functions related to querying vendors table//

//import and create pool
const pool = require('./util/pool');
const { messageNoResults, checkNoResults } = require('./util/checkFind');
const { formatVendorOutput } = require('./util/formatOutput')

/** Gets a vendor using the vedor's ID
 * @param  {number}  id  [Vendor ID]
 * @return {object}      [A single vendor object with contact info]
*/
const findVendorById = async (id) => {
  const results = await pool.query('SELECT name, description, contact_id FROM vendors WHERE id = $1', [id]);
  const noResults = checkNoResults(results);
  if (noResults) return noResults;
  const vendor = results.rows[0]
  const contact = await pool.query('SELECT * FROM contact WHERE id = $1', [vendor.contact_id])
  const vendorObj = {
    name: vendor.name,
    description: vendor.description,
    contact: contact.rows[0]
  }
  return vendorObj
}

//gets all vendor objects from the database
const findAllVendors = async () => {
   results = await pool.query('SELECT * FROM vendors ORDER BY id ASC');
   return results.rows;
}

//takes a vendor object from the request body and adds it to the database
const addVendor = async (newVendor) => {
  const { name, description, contact } = newVendor;
  const { phone, address, city, state, zip, email } = contact;
  const contactSql = 'INSERT INTO contact (phone, address, city, state, zip, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const contactRes = await pool.query(contactSql, [phone, address, city, state, zip, email]);
  const noContactResults = checkNoResults(contactRes);
  if (noContactResults) return noContactResults;
  const contactId = contactRes.rows[0].id;
  const vendorSql = 'INSERT INTO vendors (name, description, contact_id) VALUES ($1, $2, $3) RETURNING *';
  const vendorRes = await pool.query(vendorSql, [name, description, contactId]);
  const noVendorResults = checkNoResults(vendorRes);
  if (noVendorResults) return noVendorResults;
  const vendorObj = vendorRes.rows[0];
  const contactObj = contactRes.rows[0];
  const vendor = formatVendorOutput(vendorObj, contactObj);
  return vendor;
};

//takes a vendor id and a partial or full vendor object and updates the the vendor in the database
const changeVendor = async (id, updates) => {
  const existingVendor = await findVendorById(id);

  if (updates.contact) {
    for (key in existingVendor.contact) {
      if (updates.contact[key]) { existingVendor.contact[key] = updates.contact[key] }
    }
  }
  for (key in existingVendor) {
    if (updates[key] && typeof updates[key] !== 'object') { existingVendor[key] = updates[key] }
  }

  const { name, description } = existingVendor;
  const vendorSql = 'UPDATE vendors SET name = $1, description = $2 WHERE id = $3 RETURNING *' 
  const vendorRes = await pool.query(vendorSql, [name, description, id]);
  const noVendorResults = checkNoResults(vendorRes);
  if (noVendorResults) return noVendorResults;
  const contactId = vendorRes.rows[0].contact_id;
  console.log(contactId)
  const { phone, address, city, state, zip, email } = existingVendor.contact;
  const contactSql = 'UPDATE contact SET phone = $1, address = $2, city = $3, state = $4, zip = $5, email = $6 WHERE id = $7 RETURNING *';
  const contactRes = await pool.query(contactSql, [phone, address, city, state, zip, email, contactId]);
  const noContactResults = checkNoResults(contactRes);
  if (noContactResults) return noContactResults;
  const vendorObj = vendorRes.rows[0];
  const contactObj = contactRes.rows[0];
  //console.log(vendorObj)
  //console.log(contactObj)
  const updatedVendor = formatVendorOutput(vendorObj, contactObj);
  return updatedVendor;
};

//delete a vendor based on the vendor id
const removeVendor = async (id) => {
  const vendorRes = await pool.query('DELETE FROM vendors WHERE id = $1 RETURNING *', [id]);
  const noVendorResults = checkNoResults(vendorRes);
  if (noVendorResults) return noVendorResults;
  const contactId = vendorRes.contact_id;
  const contactRes = await pool.query('DELETE FROM contact WHERE id = $1', [contactId]);
  const noContactResults = checkNoResults(contactRes);
  if (noContactResults) return noContactResults;
  const deletedVendorObj = formatVendorOutput(vendorRes, contactRes);
  return deletedVendorObj;
}

module.exports = {
  findVendorById,
  findAllVendors,
  addVendor,
  changeVendor,
  removeVendor
}