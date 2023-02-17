import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { selectUser, fetchUser, login } from '../userSlice';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const handleLogin = async (e) => {
    e.preventDefault();
    await dispatch(login({
      username: e.target.username.value,
      password: e.target.password.value
    }));
    navigate('/');
    //dispatch(fetchUser());
    //navigate('/home');
  }

  return (
    <div>
      <form id="login" name='login' onSubmit={handleLogin}>
        <label htmlFor='username'>Username:</label>
        <input id='username' value='Fantom'></input>
        <label htmlFor='password' >Password:</label>
        <input id='password' value='happytime'></input>
        <button form='login' type='submit' ></button>
      </form>

    </div>
  )
}

export default Login;