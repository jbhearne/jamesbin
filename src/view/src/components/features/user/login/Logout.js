import { removeUser } from "../userSlice";
import { removeCart } from '../../../features/cart/cartSlice'
import { removeOrders } from '../../../features/orders/ordersSlice'
import { logoutToken } from "../../../../utils/apiLogin";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


function Logout(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = (e) => {
    dispatch(removeUser());
    dispatch(removeCart());
    dispatch(removeOrders());
    logoutToken();
    navigate('/user/login')
  }

  return (
    <a href='#' onClick={logout}>
      {props.children}
    </a>
  )
}

export default Logout;