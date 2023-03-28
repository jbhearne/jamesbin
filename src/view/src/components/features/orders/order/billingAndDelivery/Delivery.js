import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { selectUser, fetchUser, login } from '../../../user/userSlice';
import { setDelivery, selectIsOrderLoading, selectUseDefaultDelivery, setUseDefaultDelivery } from '../../ordersSlice';
import { apiPut } from '../../../../../utils/apiFetch';

function Delivery({ delivery, controls = true }) {
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
        <label>Receiver Name: <input id='receiverName' type='text' defaultValue={delivery.receiverName}></input></label><br />
        <label>Delivery Method: <input id='deliveryMethod' type='text' defaultValue={delivery.deliveryMethod}></input></label><br />
        <label>Delivery Notes: <input id='notes' type='text' defaultValue={delivery.notes}></input></label><br />
        <span>Contact Info:</span>
        <div>
          <span>Address:</span> 
            <div>
            <label>Street Address: <input id='address' type='text' defaultValue={delivery.contact.address}></input></label><br />
            <label>City: <input id='city' type='text' defaultValue={delivery.contact.city}></input></label> 
            <label>, State: <input id='state' type='text' defaultValue={delivery.contact.state}></input></label>
            <label>Zip Code: <input id='zip' type='text' defaultValue={delivery.contact.zip}></input></label>
            </div>
          <label>Email: <input id='email' type='email' defaultValue={delivery.contact.email}></input></label><br />
          <label>Phone: <input id='phone' type='tel' defaultValue={delivery.contact.phone}></input></label><br />
        </div>
        <input type='submit' value='Update'></input>
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
        {controls && (
          <div>
          <label>{'Use Default Delivery Info:' /*+ useDefaultDelivery*/}
            <input id='useDefaultDelivery' type='checkbox' defaultChecked={useDefaultDelivery} onClick={handleCheck}></input>
          </label>
          </div>
        )}
        {useDefaultDelivery && controls ? 
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
          {controls && (<button onClick={() => setEditMode(true)}>Edit Delivery Address</button>)}
        </div>)}
      </div>
    )
  }

  return (
    <div className='billing-delivery'>
     {editMode ? edit() : view()}
    </div>
  )

}

export default Delivery;