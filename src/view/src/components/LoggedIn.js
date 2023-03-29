import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate} from 'react-router-dom';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsloggedIn } from './features/user/userSlice';
import Login from './features/user/login/Login';

export const LoggedIn = (props) => {
  const { Component, compProps } = props;
  const isLoggedIn = useSelector(selectIsloggedIn);
  //GARBAGE const navigate = useNavigate();
  //testlog console.log(isLoggedIn)
  return (
    <div>
      {/*GARBAGE <h3>{isLoggedIn}</h3> */}
      { isLoggedIn ? <Component {...compProps}/> : <Login /> }
      { !isLoggedIn && <p className='not-logged'>Please Login First</p>}
    </div>
  )

}

export default LoggedIn;