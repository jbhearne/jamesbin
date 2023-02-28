import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, fetchUser, setIsloggedIn } from './components/features/user/userSlice';

import Home from './components/home/Home';
import Products from './components/features/products/Products';
import Product from './components/features/products/product/Product';
import Vendors from './components/features/vendors/Vendors';
import Vendor from './components/features/vendors/vendor/Vendor';
import Orders from './components/features/orders/Orders';
import Order from './components/features/orders/order/Order';
import Checkout from './components/features/orders/order/Checkout';
import Complete from './components/features/orders/order/Complete';
import Cart from './components/features/cart/Cart';
import User from './components/features/user/User';
import Login from './components/features/user/login/Login';
import Register from './components/features/user/register/Register';
import ProductPage from './components/features/products/product/ProductPage'
import LoggedIn from './components/LoggedIn';

function App() {
  //const user = {fullname: false}
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  useEffect(() => {
    dispatch(fetchUser())
    
  }, [])
  useEffect(() => {
    dispatch(setIsloggedIn(!!user.username));
  }, [user])
  
  return (
    <div className="App">
      <Router>
        <header className="App-header">
        <NavLink to=''><h1>James' Bin</h1></NavLink>
          <div id="user-login">{user.fullname || (<NavLink to='/user/login'>Login</NavLink>)}</div>
          <nav id="main-nav">
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
          <Route path='/vendor/:id' element={<Vendor />} />
          {/*<Route path='/orders' element={<Orders />} />*/}
          <Route path='/orders' element={<LoggedIn Component={Orders} compProps={{test: 'test', test2: '   test2'}} />} />
          <Route path='/order/checkout' element={<Checkout />} />
          <Route path='/order/complete' element={<Complete />} />
          <Route path='/order/:id' element={<Order />} />
          {/*<Route path='/cart' element={<Cart />} />*/}
          <Route path='/cart' element={<LoggedIn Component={Cart} />} />
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
