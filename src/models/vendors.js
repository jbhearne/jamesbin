const pool = require('./pool')

const getVendors = (request, response) => {
    pool.query('SELECT * FROM vendors ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const getVendorById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM vendors WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }


const createVendor = (request, response) => {
  const { name, description, contact } = request.body
  const { phone, address, city, state, zip, email } = contact
  let contactId = -1
  
  pool.query('INSERT INTO contact (phone, address, city, state, zip, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
  [phone, address, city, state, zip, email], 
  (error, results) => {
    if (error) {
      throw error
    }
    contactId = results.rows[0].id
  })
  
  pool.query(
    'INSERT INTO vendors (name, description, contact_id) VALUES ($1, $2, $3) RETURNING *',
    [name, description, contactId],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Vendor added with ID: ${results.rows[0].id}`)
    })
  }

const updateVendor = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, description, contact } = request.body
    const { phone, address, city, state, zip, email } = contact
    let contactId = -1

    pool.query(
      //note on UPDATE, since each column is specified in the query, the App logic needs to fill in the the unchanged values
      'UPDATE vendors SET name = $1, description = $2 WHERE id = $4 RETURNING *',
      [name, description, id],
      (error, results) => {
         if (error) {
          throw error
        }
        contactId = results.rows[0].contact_id
      }
    )

    pool.query(
      'UPDATE contact SET phone = $1, address = $2, city = $3, state = $4, zip = $5, email = $6 WHERE id = $7',
      [phone, address, city, state, zip, email, contactId],
      (error, results) => {
         if (error) {
          throw error
        }
        response.status(200).send(`Vendor modified with ID: ${id}`)
      }
    )
  }

const deleteVendor = (request, response) => {
  const id = parseInt(request.params.id)
  let contactId = -1

  pool.query('DELETE FROM vendors WHERE id = $1 RETURNING *', 
  [id],
  (error, results) => {
    if (error) {
      throw error
    }
    contactId = results.rows[0].contact_id
  })

  pool.query('DELETE FROM contact WHERE id = $1', 
  [contactId],
  (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Vendor deleted with ID: ${id}`)
  })
}

module.exports = {
    getVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor
  }
  