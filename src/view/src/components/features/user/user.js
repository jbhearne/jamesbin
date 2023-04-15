//import
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
import { selectUser, fetchUser } from './userSlice';
import { apiPut } from '../../../utils/apiFetch';
import "./user.css";

//Component for rendering and updating user info
function User() {

  //React state
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [editUsername, setEditUsername] = useState(false);

  //Redux constants 
  const dispatch = useDispatch()
  const user = useSelector(selectUser);

  //Handles the checkbox that determines if the user wants to update the username in addition to other user info
  const handleCheck = (e) => {
    setEditUsername(e.target.checked)
  }

  //on submission it builds a updateUser object and uses it to update the database. Then fetches the updated user and resets the editmode.
  const handleSubmit = async (e) => {
    e.preventDefault()
    const updateUser = {
      fullname: e.target.fullname.value,
      contact: {
        email: e.target.email.value,
        phone: e.target.phone.value,
        address: e.target.address.value,
        city: e.target.city.value,
        state: e.target.state.value,
        zip: e.target.zip.value,
      }
    }
    if (editUsername) updateUser.username = e.target.username.value;
    
    const token = localStorage.getItem("id_token");
    const result = await apiPut(`/user/${user.id}`, updateUser, token); //??? should this happen in the userSlice?
    if (result.success) {
      dispatch(fetchUser());
      setEditMode(false);
    } else {
      setMessage(result.msg);
    }
  }

  //Returns a form for updating the user info.,
  const editUser = () => {
    return (
      <div className='main-user'>
      <h2>Edit User Profile</h2>
      <label>Change Username: <input id='editUsername' type="checkbox" onClick={handleCheck} /></label>
      <form name='userProfile' onSubmit={handleSubmit}>
        {editUsername && (<div><label>Username: <input id='username' type='text' defaultValue={user.username}></input></label></div>)}
        <label>Full Name: <input id='fullname' type='text' defaultValue={user.fullname}></input></label><br />
        <span>Contact Info:</span>
        <div>
          <span>Address:</span> 
            <div>
            <label>Street Address: <input id='address' type='text' defaultValue={user.contact.address}></input></label><br />
            <label>City: <input id='city' type='text' defaultValue={user.contact.city}></input></label>, <label>State: <input id='state' type='text' defaultValue={user.contact.state}></input></label> <label>Zip Code: <input id='zip' type='text' defaultValue={user.contact.zip}></input></label>
            </div>
          <label>Email: <input id='email' type='email' defaultValue={user.contact.email}></input></label><br />
          <label>Phone: <input id='phone' type='tel' defaultValue={user.contact.phone}></input></label><br />
        </div>
        <input type='submit' value='Update'></input>
      </form>
      <button onClick={() => setEditMode(false)}>Cancel</button>
      {message && (<div>{message}</div>)}
    </div>
    )
  }
  
  //returns formatted user information for viewing and a button to change the editMode state.
  const viewUser = () => {
    return (
      <div className='main-user'>
        <h2>User Profile</h2>
        <span className='span-label'>Username:</span> <span>{user.username}</span><br />
        <span className='span-label'>Full Name:</span> <span>{user.fullname}</span><br />
        <span>Contact Info:</span>
        <div>
          <span className='span-label'>Address:</span> 
            <div>
              <span>{user.contact.address}</span><br />
              <span>{user.contact.city}</span>, <span>{user.contact.state}</span> <span>{user.contact.zip}</span>
            </div>
          <span className='span-label'>Email: </span><span>{user.contact.email}</span><br />
          <span className='span-label'>Phone: </span><span>{user.contact.phone}</span><br />
        </div>
        <button onClick={() => setEditMode(true)}>Edit Profile</button>
      </div>
    )
  }

  //Renders  either the form or formatted info based on editMode state.
  return (
    <div>
     {editMode ? editUser() : viewUser()}
    </div>
  )
}

export default User;