//GARBAGE import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, fetchUser, setIsloggedIn } from './components/features/user/userSlice';
import '@stripe/stripe-js';

import Home from './components/home/Home';
import Products from './components/features/products/Products';
//GARBAGE import Product from './components/features/products/product/Product';
import Vendors from './components/features/vendors/Vendors';
//GARBAGE  ? import Vendor from './components/features/vendors/vendor/Vendor';
import Orders from './components/features/orders/Orders';
//GARBAGE import Order from './components/features/orders/order/Order';
//GARBAGE import Checkout from './components/features/orders/order/Checkout';
import Complete from './components/features/orders/order/Complete';
import Cart from './components/features/cart/Cart';
import User from './components/features/user/User';
import Login from './components/features/user/login/Login';
import Register from './components/features/user/register/Register';
import ProductPage from './components/features/products/product/ProductPage'
import LoggedIn from './components/LoggedIn';
import Logout from './components/features/user/login/Logout';
import GetStripe from './components/features/orders/order/GetStripe';

function App() {
  //GARBAGE const user = {fullname: false}
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  useEffect(() => {
    dispatch(fetchUser())
    
  }, [])
  useEffect(() => {
    dispatch(setIsloggedIn(!!user.username));
  }, [user])
  //GARBAGE (<NavLink to='/user'>{user.fullname}</NavLink>)
  const usernameOrLogin = () => {
    if (user.username) {
      return (
        <div>
          <NavLink to='/user'>{user.username}</NavLink> <Logout>Logout</Logout>
        </div>
      )
    }
    return (
      <div>
        <NavLink to='/user/login'>Login</NavLink>
      </div>
    )
  }

  return (
    <div className="App">
      <Router>
        <header className="App-header">

            <div id="user-login" className="user-login">{usernameOrLogin()}</div>
            <NavLink className="titleLink" to=''><h1>James' Bin</h1></NavLink>
            

          <nav id="main-nav" className="main-nav">
            <ul>
              <li><NavLink to='products'>Products</NavLink></li>
              <li><NavLink to='vendors'>Vendors</NavLink></li>
              <li><NavLink to='orders'>Orders</NavLink></li>
              <li><NavLink to='cart'>Cart</NavLink></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/product/:id' element={<ProductPage />} />
          <Route path='/vendors' element={<Vendors />} />
          {/*TODO ? <Route path='/vendor/:id' element={<Vendor />} /> */}
          {/*<Route path='/orders' element={<Orders />} />*/}
          <Route path='/orders' element={<LoggedIn Component={Orders} compProps={{test: 'test', test2: '   test2'}} />} />
          <Route path='/order/checkout' element={<GetStripe />} />
          <Route path='/order/complete' element={<Complete />} />
          {/*TODO ? <Route path='/order/:id' element={<Order />} /> */}
          <Route path='/cart' element={<Cart controls={true} />} />
          {/*GARBAGE <Route path='/cart' element={<LoggedIn Component={Cart} />} />*/}
          <Route path='/user/register' element={<Register />} />
          <Route path='/user/login' element={<Login />} />
          <Route path='/user' element={<User />} />

          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
