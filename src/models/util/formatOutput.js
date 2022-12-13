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

//creates a new contact in the contact table. Returns a contact object.
const formatNewContact = (newContact) => {
  //newContact = await addContactInfo(contactObj) //REVIEW - if this should even be in a formatting function. probably not since it makes it different than the funcitons below.
  
  contact = {
    id: newContact.id,
    phone: newContact.phone,
    address: newContact.address,
    city: newContact.city,
    state: newContact.state,
    zip: newContact.zip,
    email: newContact.email
  }
  return contact
}

//formats a delivery object with specified ID, a previous or requested delivery object, and a contact object. No queries. Returns the object.
const formatNewDelivery =  (deliveryId, deliveryObj, contactObj) => {
  const delivery = {
    id: deliveryId,
    receiverName: deliveryObj.receiverName,
    deliveryMethod: deliveryObj.deliveryMethod,
    notes: deliveryObj.notes,
    contact: contactObj
  }
  return delivery
}

//formats a billing object with specified ID, a previous or requested billing object, and a contact object. No queries. Returns the object.
const formatNewBilling =  (billingId, billingObj, contactObj) => {
  const billing = {
    id: billingId,
    payerName: billingObj.payerName,
    paymentMethod: billingObj.paymentMethod,
    contact: contactObj
  }
  return billing
}

module.exports = {
  formatUserOutput,
  formatNewContact,
  formatNewDelivery,
  formatNewBilling
}