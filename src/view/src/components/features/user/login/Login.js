//imports
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { fetchUser, setIsloggedIn } from '../userSlice';
import { fetchLogin } from '../../../../utils/apiLogin';
import './Login.css'

//Component that renders a form used to login 
function Login() {

  //Redux constants
  const dispatch = useDispatch();

  //React Router constants
  const navigate = useNavigate();

  //on submmission handleLogin fetches to the server login logic and checks the input against the database. if successful the user state is fetched and the user is redirected to the home.
  const handleLogin = async (e) => { //TODO add this to userSlice to set JWT expires state.
    e.preventDefault();
    const isLoggedIn = await fetchLogin({
      username: e.target.username.value,
      password: e.target.password.value
    })

    dispatch(setIsloggedIn(isLoggedIn))
    dispatch(fetchUser());
    if(isLoggedIn) {
      navigate('/');
    }

  }

  //Renders the login form
  return (
    <div className='main-login'>
      <form id="login" name='login' onSubmit={handleLogin}>
        <div className='login-field'>
          <label htmlFor='username'>Username:</label>
          <input type='text' id='username' ></input>
        </div>
        <div className='login-field'>
          <label htmlFor='password' >Password:</label>
          <input type='password' id='password' ></input>
        </div>
        <button form='login' type='submit' >Login</button>
      </form>
      <Link className='registerLink' to='/user/register'>Register</Link>
    </div>
  )
}

export default Login;