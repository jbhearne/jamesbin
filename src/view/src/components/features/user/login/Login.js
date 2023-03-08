import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { selectUser, fetchUser, login, setIsloggedIn } from '../userSlice';
import { fetchLogin } from '../../../../utils/apiLogin';
import './Login.css'

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const handleLogin = async (e) => {
    e.preventDefault();
    const isLoggedIn = await fetchLogin({
      username: e.target.username.value,
      password: e.target.password.value
    })
    /*GARBAGE await dispatch(login({
      username: e.target.username.value,
      password: e.target.password.value
    }));*/
    dispatch(setIsloggedIn(isLoggedIn))
    dispatch(fetchUser());
    if(isLoggedIn) {
      navigate('/');
    }
    //GARBAGE dispatch(fetchUser());
    //GARBAGE navigate('/home');
  }

  return (
    <div>
      <form id="login" name='login' onSubmit={handleLogin}>
        <label htmlFor='username'>Username:</label>
        <input id='username' defaultValue='Fantom'></input>
        <label htmlFor='password' >Password:</label>
        <input id='password' defaultValue='happytime'></input>
        <button form='login' type='submit' ></button>
      </form>
      <Link className='registerLink' to='/user/register'>Register</Link>
    </div>
  )
}

export default Login;