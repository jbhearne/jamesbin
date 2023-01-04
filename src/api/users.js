////////////////////////////////////////////////////////////
///User based HTTP requests/response for RESTful API///////

//imports
const { checkForFoundRowObj, checkForFoundRowsArr } = require('../models/util/checkFind');
const { 
  findUserById,
   isUsernameUnique,
    findAllUsers,
    changeUser,
    removeUser
   } = require('../models/findUser')

//gets all users from the database and sends a response object
const getUsers = async (request, response) => {
  try {
    const users = await findAllUsers();
    const check = checkForFoundRowsArr(users);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//gets a user from the database using id parameter and sends a response object.
const getUserById = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const user = await findUserById(id);
    const check = checkForFoundRowObj(user);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//updates user and contact databases. request body can be any combination of properties as long as it follows the correct user object structure
const updateUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const updates = request.body;
  try {
    const updatedUser = await changeUser(id, updates);
    const check = checkForFoundRowObj(updatedUser);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`User modified with ID: ${check.results.id} updated.`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//deletes a user and their coresponding contact info in database
const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const deletedUser = await removeUser(id);
    const check = checkForFoundRowObj(deletedUser);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`User deleted with ID: ${check.results.id} updated.`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
}
  