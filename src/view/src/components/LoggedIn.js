//GARBAGE import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate} from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Login from './features/user/login/Login';
import { selectUser, fetchUser, selectIsloggedIn } from './features/user/userSlice';

export const LoggedIn = (props) => {
  const { Component, compProps } = props;
  const isLoggedIn = useSelector(selectIsloggedIn);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const expires = new Date(user.tokenExpires);
    if (expires < Date.now()) {
      dispatch(fetchUser());
    }
  }, []);

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