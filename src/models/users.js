////////////////////////////////////////////////////////////
///User based HTTP requests/response for RESTful API///////

//imports
const { 
  findUserById,
   isUsernameUnique,
    findAllUsers,
    changeUser,
    removeUser
   } = require('./util/findUser')

//gets all users from the database and sends a response object
const getUsers = async (request, response) => {
  const users = await findAllUsers();
  response.status(200).json(users)
}

//gets a user from the database using id parameter and sends a response object.
const getUserById = async (request, response) => {
  const id = parseInt(request.params.id);
  const user = await findUserById(id);
  if (user) {
    response.status(200).json(user)
  } else {
    response.status(400).send(`no such user.`);
  }
}

//updates user and contact databases. request body can be any combination of properties as long as it follows the correct user object structure
const updateUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const updates = request.body;
  const updatedUser = await changeUser(id, updates)
  if (typeof updatedUser === 'object') {  //IDEA create an error checking function that makes sure user object conforms to spec.
    response.status(200).send(`User modified with ID: ${id}`);
  } else if (typeof updatedUser === 'string') {
    response.status(400).send(updatedUser);
  } else {
    throw Error(`updatedUser = ${updatedUser}`)
  }
}

//deletes a user and their coresponding contact info in database
const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const deletedUser = await removeUser(id);
  if (typeof deletedUser === 'object') {  //IDEA create an error checking function that makes sure user object conforms to spec.
    response.status(200).send(`User deleted with ID: ${id}`);
  } else if (typeof deletedUser === 'string') {
    response.status(400).send(deletedUser);
  } else {
    throw Error(`deletedUser = ${deletedUser}`);
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
}
  