////////////////////////////////////////////////////////////
///Vendor based HTTP requests/response for RESTful API///////

//imports
const pool = require('./util/pool');
const { 
  findVendorById, 
  findAllVendors,
  addVendor,
  changeVendor,
  removeVendor
} = require('./util/findVendor')

//get all vendors
const getVendors = async (request, response) => {
  const vendors = await findAllVendors();
  response.status(200).json(vendors);
}

//get a vendor using vendor ID route parameter
const getVendorById = async (request, response) => {
  const id = parseInt(request.params.id);
  const vendor = await findVendorById(id);
  response.status(200).json(vendor);
}

//create a Vendor
const createVendor = async (request, response) => {
  const vendor = await addVendor(request.body);
  response.status(201).send(`Vendor added with ID: ${vendor.id}`)
}

//update a vendor. querys vendor table and compares old vendor info to new vendor info 
const updateVendor = async (request, response) => {
    const id = parseInt(request.params.id);
    const vendor = await changeVendor(id, request.body);
    response.status(200).send(`Vendor modified with ID: ${vendor.id}`); 
}

//delete a Vendor
const deleteVendor = async (request, response) => {
  const id = parseInt(request.params.id);
  const deletedVendor = await removeVendor(id);
  response.status(200).send(`Vendor deleted with ID: ${deletedVendor.id}`);
}

module.exports = {
    getVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor
  }
  