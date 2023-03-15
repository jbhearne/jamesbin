import { removeUser } from "../userSlice";
import { removeCart } from '../../../features/cart/cartSlice'
import { removeOrders, removeCheckoutOrder, removeOrderItems, removeCompleteOrder } from '../../../features/orders/ordersSlice'
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
    dispatch(removeCheckoutOrder());
    dispatch(removeOrderItems());
    dispatch(removeCompleteOrder());
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