import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { selectUser, fetchUser, login } from './userSlice';
import { apiPut } from '../../../utils/apiFetch';

function User() {
  const user = useSelector(selectUser);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [editUsername, setEditUsername] = useState(false);
  const dispatch = useDispatch()

  const handleCheck = (e) => {
    setEditUsername(e.target.checked)
  }

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
    const result = await apiPut(`/user/${user.id}`, updateUser, token);
    if (result.success) {
      dispatch(fetchUser());
      setEditMode(false);
    } else {
      setMessage(result.msg);
    }
  }

  const editUser = () => {
    return (
      <div>
      <h2>Edit User Profile</h2>
      <label>Change Username: <input id='editUsername' type="checkbox" onClick={handleCheck} /></label>
      <form name='userProfile' onSubmit={handleSubmit}>
        {editUsername && (<div><label>Username: <input id='username' type='text' defaultValue={user.username}></input></label></div>)}
        <label>Full Name:</label> <input id='fullname' type='text' defaultValue={user.fullname}></input><br />
        <span>Contact Info:</span>
        <div>
          <span>Address:</span> 
            <div>
            <label>Street Address: </label><input id='address' type='text' defaultValue={user.contact.address}></input><br />
            <label>City: </label><input id='city' type='text' defaultValue={user.contact.city}></input>, <label>State: </label><input id='state' type='text' defaultValue={user.contact.state}></input> <label>Zip Code: </label><input id='zip' type='text' defaultValue={user.contact.zip}></input>
            </div>
          <label>Email: </label><input id='email' type='email' defaultValue={user.contact.email}></input><br />
          <label>Phone: </label><input id='phone' type='tel' defaultValue={user.contact.phone}></input><br />
        </div>
        <label>Update: </label><input type='submit'></input>
      </form>
      <button onClick={() => setEditMode(false)}>Cancel</button>
      {message && (<div>{message}</div>)}
    </div>
    )
  }
  
  const viewUser = () => {
    return (
      <div>
        <h2>User Profile</h2>
        <span>Username:</span> <span>{user.username}</span><br />
        <span>Full Name:</span> <span>{user.fullname}</span><br />
        <span>Contact Info:</span>
        <div>
          <span>Address:</span> 
            <div>
              <span>{user.contact.address}</span><br />
              <span>{user.contact.city}</span>, <span>{user.contact.state}</span> <span>{user.contact.zip}</span>
            </div>
          <span>Email: </span><span>{user.contact.email}</span><br />
          <span>Phone: </span><span>{user.contact.phone}</span><br />
        </div>
        <button onClick={() => setEditMode(true)}>Edit Profile</button>
      </div>
    )
  }

  return (
    <div>
     {editMode ? editUser() : viewUser()}
    </div>
  )
}

export default User;