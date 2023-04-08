//Imports
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Login from './features/user/login/Login';
import { selectUser, fetchUser, selectIsloggedIn } from './features/user/userSlice';


//Component used to check login status and pass a different comonent through if the user is logged in. 
export const LoggedIn = (props) => {
  //props: a component to render if logged in and any props that need to passed to that component
  const { Component, compProps } = props;

  //set redux constants
  const isLoggedIn = useSelector(selectIsloggedIn);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  //checks if the JWT is expired which will result in the user state being unset and isLoggedIn setting false.
  useEffect(() => {
    const expires = new Date(user.tokenExpires);
    if (expires < Date.now()) {
      dispatch(fetchUser());
    }
  }, []);

  //testlog console.log(isLoggedIn)

  //renders the passed component with passed props or the Login component.
  return (
    <div>
      { isLoggedIn ? <Component {...compProps}/> : <Login /> }
      { !isLoggedIn && <p className='not-logged'>Please Login First</p>}
    </div>
  )

}

export default LoggedIn;