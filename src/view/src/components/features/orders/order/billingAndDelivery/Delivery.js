import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { selectUser, fetchUser, login } from '../../../user/userSlice';
import { setDelivery, selectIsOrderLoading, selectUseDefaultDelivery, setUseDefaultDelivery } from '../../ordersSlice';
import { apiPut } from '../../../../../utils/apiFetch';

function Delivery({ delivery }) {
  const useDefaultDelivery = useSelector(selectUseDefaultDelivery);
  const user = useSelector(selectUser);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch()

  const handleCheck = (e) => {
    dispatch(setUseDefaultDelivery(e.target.checked))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newDelivery = {
      receiverName: e.target.receiverName.value,
      deliveryMethod: e.target.deliveryMethod.value,
      notes: e.target.notes.value,
      contact: {
        email: e.target.email.value,
        phone: e.target.phone.value,
        address: e.target.address.value,
        city: e.target.city.value,
        state: e.target.state.value,
        zip: e.target.zip.value,
      }
    }
    dispatch(setDelivery(newDelivery))
    //const token = localStorage.getItem("id_token");
  }

  const edit = () => {
    return (
      <div>
      <h3>Edit Delivery Address</h3>
      <form name='userProfile' onSubmit={handleSubmit}>
        <label>Receiver Name:</label> <input id='receiverName' type='text' defaultValue={delivery.receiverName}></input><br />
        <label>Delivery Method:</label> <input id='deliveryMethod' type='text' defaultValue={delivery.deliveryMethod}></input><br />
        <label>Delivery Notes:</label> <input id='notes' type='text' defaultValue={delivery.notes}></input><br />
        <span>Contact Info:</span>
        <div>
          <span>Address:</span> 
            <div>
            <label>Street Address: </label><input id='address' type='text' defaultValue={delivery.contact.address}></input><br />
            <label>City: </label><input id='city' type='text' defaultValue={delivery.contact.city}></input>, 
            <label>State: </label><input id='state' type='text' defaultValue={delivery.contact.state}></input> 
            <label>Zip Code: </label><input id='zip' type='text' defaultValue={delivery.contact.zip}></input>
            </div>
          <label>Email: </label><input id='email' type='email' defaultValue={delivery.contact.email}></input><br />
          <label>Phone: </label><input id='phone' type='tel' defaultValue={delivery.contact.phone}></input><br />
        </div>
        <label>Update: </label><input type='submit'></input>
      </form>
      <button onClick={() => setEditMode(false)}>View Delivery Address</button>
      {message && (<div>{message}</div>)}
    </div>
    )
  }
  
  const view = () => {
    return (
      <div>
        <h3>Delivery</h3>
        <label>{'Use Default Delivery Info:' /*+ useDefaultDelivery*/}<input id='useDefaultDelivery' type='checkbox' defaultChecked={useDefaultDelivery} onClick={handleCheck}></input></label><br />
        {useDefaultDelivery ? 
        (
        <span>{delivery.contact.address}</span>
        ) : (
        <div>
          <span>Name:</span> <span>{delivery.receiverName}</span><br />
          <span>Delivery Method:</span> <span>{delivery.deliveryMethod}</span><br />
          <span>Delivery Notes:</span> <span>{delivery.notes}</span><br />
          <span>Contact Info:</span>
          <div>
            <span>Address:</span> 
              <div>
                <span>{delivery.contact.address}</span><br />
                <span>{delivery.contact.city}</span>, <span>{delivery.contact.state}</span> <span>{delivery.contact.zip}</span>
              </div>
            <span>Email: </span><span>{delivery.contact.email}</span><br />
            <span>Phone: </span><span>{delivery.contact.phone}</span><br />
          </div>
          <button onClick={() => setEditMode(true)}>Edit Delivery Address</button>
        </div>)}
      </div>
    )
  }

  return (
    <div>
     {editMode ? edit() : view()}
    </div>
  )

}

export default Delivery;