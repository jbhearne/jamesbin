////////////////////////////////////////////////////////////
///Vendor based HTTP requests/response for RESTful API///////

//imports
const { checkForFoundRowObj, checkForFoundRowsArr } = require('../models/util/checkFind')
const { 
  findVendorById, 
  findAllVendors,
  addVendor,
  changeVendor,
  removeVendor
} = require('../models/findVendor')

//get all vendors
const getVendors = async (request, response) => {
  try {
    const vendors = await findAllVendors();
    const check = checkForFoundRowsArr(vendors);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//get a vendor using vendor ID route parameter
const getVendorById = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const vendor = await findVendorById(id);
    const check = checkForFoundRowObj(vendor);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//create a Vendor
const createVendor = async (request, response) => {
  try {
    const vendor = await addVendor(request.body);
    const check = checkForFoundRowObj(vendor);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Vendor added with ID: ${check.results.id}`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//update a vendor. querys vendor table and compares old vendor info to new vendor info 
const updateVendor = async (request, response) => {
    const id = parseInt(request.params.id);
    try {
      const vendor = await changeVendor(id, request.body);
      const check = checkForFoundRowObj(vendor);
      if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
      if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Vendor modified with ID: ${check.results.id}`);
    } catch (err) {
      console.error(err);
      throw new Error('API failure: ' + err);
    }
}

//delete a Vendor
const deleteVendor = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const deletedVendor = await removeVendor(id);
    const check = checkForFoundRowObj(deletedVendor);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Vendor deleted with ID: ${check.results.id}`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

module.exports = {
    getVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor
  }
  