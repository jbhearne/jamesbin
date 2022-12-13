const formatUserOutput = (user, contact) => {
  userObj = {
    id: user.id,
    fullname: user.fullname,
    username: user.username,
    Contact: {
      id: contact.id,
      phone: contact.phone,
      address: contact.address,
      city: contact.city,
      state: contact.state,
      zip: contact.zip,
      email: contact.email
    }
  }

  return userObj
}

module.exports = {
  formatUserOutput
}