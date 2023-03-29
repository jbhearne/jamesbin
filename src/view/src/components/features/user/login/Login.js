import { useDispatch } from 'react-redux'
//GARBAGE import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUser, setIsloggedIn } from '../userSlice';
import { fetchLogin } from '../../../../utils/apiLogin';
import './Login.css'

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //GARBAGE const user = useSelector(selectUser);
  const handleLogin = async (e) => { //TODO add this to userSlice to set JWT expires state.
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
    <div className='main-login'>
      <form id="login" name='login' onSubmit={handleLogin}>
        <div className='login-field'>
          <label htmlFor='username'>Username:</label>
          <input id='username' defaultValue='Fantom'></input>
        </div>
        <div className='login-field'>
          <label htmlFor='password' >Password:</label>
          <input id='password' defaultValue='happytime'></input>
        </div>
        <button form='login' type='submit' >Login</button>
      </form>
      <Link className='registerLink' to='/user/register'>Register</Link>
    </div>
  )
}

export default Login;