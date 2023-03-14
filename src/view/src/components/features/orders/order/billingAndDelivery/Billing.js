
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { selectUser, fetchUser, login } from '../../../user/userSlice';
import { 
  setBilling, 
  selectIsOrderLoading, 
  setUseDefaultBilling,
  selectUseDefaultBilling,
 } from '../../ordersSlice';
import { apiPut } from '../../../../../utils/apiFetch';


function Billing({ billing }) {
  const isLoading = useSelector(selectIsOrderLoading);
  const useDefaultBilling = useSelector(selectUseDefaultBilling);
  const user = useSelector(selectUser);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch()

  useEffect(() => {

  })

  const handleCheck = (e) => {
    dispatch(setUseDefaultBilling(e.target.checked))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newBilling = {
      payerName: e.target.payerName.value,
      paymentMethod: e.target.paymentMethod.value,
      contact: {
        email: e.target.email.value,
        phone: e.target.phone.value,
        address: e.target.address.value,
        city: e.target.city.value,
        state: e.target.state.value,
        zip: e.target.zip.value,
      }
    }
    dispatch(setBilling(newBilling))
    //const token = localStorage.getItem("id_token");
  }

  const edit = () => {
    return (
      <div>
      <h3>Edit Billing Address</h3>
      <form name='userProfile' onSubmit={handleSubmit}>
        <label>Payer Name:</label> <input id='payerName' type='text' defaultValue={billing.payerName}></input><br />
        <label>Payment Method:</label> <input id='paymentMethod' type='text' defaultValue={billing.paymentMethod}></input><br />
        <span>Contact Info:</span>
        <div>
          <span>Address:</span> 
            <div>
            <label>Street Address: </label><input id='address' type='text' defaultValue={billing.contact.address}></input><br />
            <label>City: </label><input id='city' type='text' defaultValue={billing.contact.city}></input>, 
            <label>State: </label><input id='state' type='text' defaultValue={billing.contact.state}></input> 
            <label>Zip Code: </label><input id='zip' type='text' defaultValue={billing.contact.zip}></input>
            </div>
          <label>Email: </label><input id='email' type='email' defaultValue={billing.contact.email}></input><br />
          <label>Phone: </label><input id='phone' type='tel' defaultValue={billing.contact.phone}></input><br />
        </div>
        <label>Update: </label><input type='submit'></input>
      </form>
      <button onClick={() => setEditMode(false)}>View Billing Address</button>
      {message && (<div>{message}</div>)}
    </div>
    )
  }
  
  const view = () => {
    console.log('view')
    console.log(billing)
    return (
      <div>
        <h3>Billing</h3>
        <label>{'Use Default Billing Info:' /*+ useDefaultBilling*/}<input id='useDefaultBilling' type='checkbox' defaultChecked={useDefaultBilling} onClick={handleCheck}></input></label><br />
        {useDefaultBilling ? (<span>{billing.contact.address}</span>) : (
          <div>
            <span>Name:</span> <span>{billing.payerName}</span><br />
            <span>Payment Method:</span> <span>{billing.paymentMethod}</span><br />
            <span>Contact Info:</span>
            <div>
              <span>Address:</span> 
                <div>
                  <span>{billing.contact.address}</span><br />
                  <span>{billing.contact.city}</span>, <span>{billing.contact.state}</span> <span>{billing.contact.zip}</span>
                </div>
              <span>Email: </span><span>{billing.contact.email}</span><br />
              <span>Phone: </span><span>{billing.contact.phone}</span><br />
            </div>
          </div>
          )}
        {useDefaultBilling ? ('') : ( <button onClick={() => setEditMode(true)}>Edit Billing Address</button> ) }
      </div>
    )
  }

  return (
    <div>
     {isLoading ? (<p>loading</p>) : (editMode ? edit() : view())}
    </div>
  )

}

export default Billing;