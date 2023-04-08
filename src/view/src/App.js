//Dependencies
import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink, useSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, fetchUser, setIsloggedIn } from './components/features/user/userSlice';
import '@stripe/stripe-js';

//Components
import Home from './components/home/Home';
import Products from './components/features/products/Products';
import Vendors from './components/features/vendors/Vendors';
import Orders from './components/features/orders/Orders';
import Complete from './components/features/orders/order/Complete';
import Cart from './components/features/cart/Cart';
import User from './components/features/user/User';
import Login from './components/features/user/login/Login';
import Register from './components/features/user/register/Register';
import ProductPage from './components/features/products/product/ProductPage'
import LoggedIn from './components/LoggedIn';
import Logout from './components/features/user/login/Logout';
import GetStripe from './components/features/orders/order/GetStripe';

//Top level of react application containing all other components
function App() {

  //set redux constants
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  //Get user info from database and saves to redux on when the app loads.
  useEffect(() => {
    dispatch(fetchUser())
  }, [])

  //Sets login state if there is a change to the user state. 
  useEffect(() => {
    dispatch(setIsloggedIn(!!user.username));
  }, [user])
  
  //Condition to display either the username and logout link or login link.
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
  
  //render the application and setup react router
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
          <Route path='/orders' element={<LoggedIn Component={Orders} compProps={{test: 'test', test2: '   test2'}} />} />
          <Route path='/order/checkout' element={<GetStripe />} />
          <Route path='/order/complete' element={<Complete />} />
          {/*TODO ? <Route path='/order/:id' element={<Order />} /> */}
          <Route path='/cart' element={<Cart controls={true} />} />
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
