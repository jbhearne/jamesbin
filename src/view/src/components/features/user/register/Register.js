
import { apiPost } from '../../../../utils/apiFetch';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Register() {
  const [ message, setMessage ] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newUser = {
      username: e.target.username.value,
      password: e.target.password.value,
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
    const result = await apiPost('/register', newUser);
    if (result.success) {
      navigate('/user/login');
    } 
    setMessage(result.msg);
  }

  return (
    <div>
      <form name='register' onSubmit={handleSubmit}>
        <label>username<input type='text' id='username' required='true'></input></label><br />
        <label>password<input type='password' id='password' required='true'></input></label><br />
        <hr />
        <label>fullname<input type='text' id='fullname' required='true'></input></label><br />
        <hr />
        <label>email<input type='email' id='email'></input></label><br />
        <label>phone<input type='tel' id='phone'></input></label><br />
        <label>address<input type='text' id='address'></input></label><br />
        <label>city<input type='text' id='city'></input></label><br />
        <label>state<input type='text' id='state'></input></label><br />
        <label>zip<input type='text' id='zip'></input></label><br />
        <label>Register<input type='submit' id='submit'></input></label>
      </form>
      <p>{message}</p>
    </div>
  )
}

export default Register;