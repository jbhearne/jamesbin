const pool = require('./pool');

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

module.exports = {
  findVendorById
}