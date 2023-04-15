//import
import { removeUser } from "../userSlice";
import { removeCart } from '../../../features/cart/cartSlice'
import { removeOrders, removeCheckoutOrder, removeOrderItems, removeCompleteOrder } from '../../../features/orders/ordersSlice'
import { logoutToken } from "../../../../utils/apiLogin";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import './logout.css';


//Component that used to create a logout link
function Logout(props) {
  //props: no custom props are passed dow, but need to access child nodes (embedded text) to create the link.

  //Redux constants
  const dispatch = useDispatch();

  //React Router constants
  const navigate = useNavigate();

  //When the link is clicked it removes the state of all user specific information, deletes the JWT from local storage, and redirects to the login form.
  const logout = (e) => {
    dispatch(removeUser());
    dispatch(removeCart());
    dispatch(removeOrders());
    dispatch(removeCheckoutOrder());
    dispatch(removeOrderItems());
    dispatch(removeCompleteOrder());
    logoutToken();
    navigate('/user/login')
  }

  //Renders any text nodes or other elements as a link that logs the user out.
  return (
    <button className="logout" onClick={logout}>
      {props.children}
    </button>
  )
}

export default Logout;