import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>James' Bin</h1>
        <div id="user-login">LOGIN</div>
        <nav id="main-nav">
          <ul>
            <li><NavLink>Products</NavLink></li>
            <li><NavLink>Vendors</NavLink></li>
            <li><NavLink>Orders</NavLink></li>
            <li><NavLink>Cart</NavLink></li>
          </ul>
        </nav>
      </header>
      <main>
        <Router>
          <Routes>
            <Route path='/' component={} />
            <Route path='/products' component={} />
            <Route path='/product/:id' component={} />
            <Route path='/vendors' component={} />
            <Route path='/vendor/:id' component={} />
            <Route path='/orders' component={} />
            <Route path='/order/checkout' component={} />
            <Route path='/order/complete' component={} />
            <Route path='/order/:id' component={} />
            <Route path='/cart' component={} />
            <Route path='/checkout' component={} />
            <Route path='/user/register' component={} />
            <Route path='/user/login' component={} />
            <Route path='/user' component={} />
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;
