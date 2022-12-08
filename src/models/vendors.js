//////////////////////////////////////////////////////////////////
///Database Server Functions for interacting with vendors table///

//imports
const pool = require('./util/pool');
const { findVendorById } = require('./util/findVendor')

//get all vendors
const getVendors = (request, response) => {
    pool.query('SELECT * FROM vendors ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

//get a vendor using vendor ID route parameter
const getVendorById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM vendors WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

//create a Vendor
const createVendor = (request, response) => {
  const { name, description, contact } = request.body
  const { phone, address, city, state, zip, email } = contact
  
  pool.query('INSERT INTO contact (phone, address, city, state, zip, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
  [phone, address, city, state, zip, email], 
  (error, results) => {
    if (error) {
      throw error
    }
    const contactId = results.rows[0].id
    pool.query(
        'INSERT INTO vendors (name, description, contact_id) VALUES ($1, $2, $3) RETURNING *',
        [name, description, contactId],
        (error, results) => {
          if (error) {
            throw error
          }
          response.status(201).send(`Vendor added with ID: ${results.rows[0].id}`)
        });
  });
};

//update a vendor. querys vendor table and compares old vendor info to new vendor info 
const updateVendor = async (request, response) => {
    const id = parseInt(request.params.id)
    const updates = request.body
    const vendorObj = await findVendorById(id);

    if (updates.contact) {
      for (key in vendorObj.contact) {
        console.log(updates.contact[key])
        console.log(vendorObj.contact[key])
        if (updates.contact[key]) { vendorObj.contact[key] = updates.contact[key] }
      }
    }

    for (key in vendorObj) {
      if (updates[key] && typeof updates[key] !== 'object') { vendorObj[key] = updates[key] }
    }

    const { name, description, contact } = vendorObj;
    const vendorSql = 'UPDATE vendors SET name = $1, description = $2 WHERE id = $3 RETURNING *' 

    pool.query(
      vendorSql,
      [name, description, id],
      async (error, results) => {
        if (error) {
          throw error;
        }
        const contactId = await results.rows[0].contact_id;
        const { phone, address, city, state, zip, email } = contact;
        const contactSql = 'UPDATE contact SET phone = $1, address = $2, city = $3, state = $4, zip = $5, email = $6 WHERE id = $7';

        pool.query(
          contactSql,
          [phone, address, city, state, zip, email, contactId],
          (error, results) => {
            if (error) {
              throw error;
            }
            response.status(200).send(`User modified with ID: ${id}`); 
        });
  });
};

//delete a Vendor
const deleteVendor = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM vendors WHERE id = $1 RETURNING *', 
  [id],
  (error, results) => {
    if (error) {
      throw error
    }
    const contactId = results.rows[0].contact_id

    pool.query('DELETE FROM contact WHERE id = $1', 
    [contactId],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Vendor deleted with ID: ${id}`)
    })
  })
}

module.exports = {
    getVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor
  }
  