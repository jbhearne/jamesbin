
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
//GARBAGE import { Link } from 'react-router-dom';
//GARBAGE import { selectUser } from '../../../user/userSlice';
import { 
  setBilling, 
  /*GARBAGE  selectIsOrderLoading , */
  setUseDefaultBilling,
  selectUseDefaultBilling,
 } from '../../ordersSlice';
//GARBAGE import { apiPut } from '../../../../../utils/apiFetch';


function Billing({ billing, controls = true }) {
  //GARBAGE const isLoading = useSelector(selectIsOrderLoading);
  const useDefaultBilling = useSelector(selectUseDefaultBilling);
  //GARBAGE const user = useSelector(selectUser);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch()

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
    //GARBAGE const token = localStorage.getItem("id_token");
  }

  const edit = () => {
    return (
      <div>
      <h3>Edit Billing Address</h3>
      <form name='userProfile' onSubmit={handleSubmit}>
        <label>Payer Name: <input id='payerName' type='text' defaultValue={billing.payerName}></input></label><br />
        <label>Payment Method: <input id='paymentMethod' type='text' defaultValue={billing.paymentMethod}></input></label><br />
        <span>Contact Info:</span>
        <div>
          <span>Address:</span> 
            <div>
            <label>Street Address: <input id='address' type='text' defaultValue={billing.contact.address}></input></label><br />
            <label>City: <input id='city' type='text' defaultValue={billing.contact.city}></input></label>
            <label>, State: <input id='state' type='text' defaultValue={billing.contact.state}></input></label> 
            <label>Zip Code: <input id='zip' type='text' defaultValue={billing.contact.zip}></input></label>
            </div>
          <label>Email: <input id='email' type='email' defaultValue={billing.contact.email}></input></label><br />
          <label>Phone: <input id='phone' type='tel' defaultValue={billing.contact.phone}></input></label><br />
        </div>
        <input type='submit' value='Update'></input>
      </form>
      <button onClick={() => setEditMode(false)}>View Billing Address</button>
      {message && (<div>{message}</div>)}
    </div>
    )
  }
  
  const view = () => {
    //testlog console.log('view')
    //testlog console.log(billing)
    return (
      <div>
        <h3>Billing</h3>
        {controls && (
          <div>
            <label>{'Use Default Billing Info:' /*+ useDefaultBilling*/}
              <input id='useDefaultBilling' type='checkbox' defaultChecked={useDefaultBilling} onClick={handleCheck}></input>
            </label>
          </div>
        )}
        {useDefaultBilling && controls ? (
          <span>{billing.contact.address}</span>
        ) : (
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
            {controls && (<button onClick={() => setEditMode(true)}>Edit Billing Address</button>)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='billing-delivery'>
     {editMode ? edit() : view()}
    </div>
  )

}

export default Billing;