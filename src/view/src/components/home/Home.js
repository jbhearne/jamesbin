/*GARBAGE import { fetchUser, setIsloggedIn, removeUser } from "../features/user/userSlice";
import { removeCart } from '../features/cart/cartSlice'
import { removeOrders } from '../features/orders/ordersSlice'
import { logoutToken } from "../../utils/apiLogin";
import { useDispatch } from "react-redux";

import Logout from "../features/user/login/Logout"; */
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import "./home.css"


function Home() {

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("redirect_status") === "succeeded") {  //TODO store this info and use instead of redirect_status payment_intent=pi_RANDOMCHARS&payment_intent_client_secret=pi_RANDOMCHARS_secret_RANDOMCHARSmm
      navigate('/order/complete')
    }
  }, [])
  //GARBAGE const dispatch = useDispatch();

  /*GARBAGE useEffect(() => {
    dispatch(fetchUser())
  }, []);*/

 /*GARBAGE  const handleTest = (e) => {
    dispatch(fetchUser())
  } */

  /*GARBAGE const logoutTest = (e) => {
    dispatch(removeUser());
    dispatch(removeCart());
    dispatch(removeOrders());
    logoutToken();
  } */

  return (
    <div className="main-home">
      <h2>World's Finest Spycraft Retailer</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor egestas dapibus. In tincidunt 
        facilisis mi vel commodo. Sed pretium nisi tortor, et suscipit ex pellentesque congue. Pellentesque mollis 
        tellus semper laoreet suscipit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur 
        ridiculus mus. Phasellus eget venenatis quam. Praesent posuere, tellus at viverra tempus, eros lectus 
        eleifend sem, at finibus urna dui ac arcu. Vestibulum vel dolor vitae urna lobortis blandit sed nec est. 
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam feugiat, 
        dolor ut vulputate mollis, nibh sapien aliquam metus, sit amet pellentesque quam erat non elit. Proin 
        vehicula facilisis blandit. Morbi laoreet vitae turpis hendrerit vestibulum. Vestibulum justo neque, 
        pretium nec efficitur a, accumsan porttitor lacus.</p>
      <p>Nulla mollis mattis diam, in finibus urna vehicula nec. Nullam posuere vulputate nulla in iaculis. 
        Sed rhoncus convallis lorem, fringilla maximus magna dignissim vitae. Nullam tempor lectus vel tellus 
        lacinia, a tristique elit bibendum. Nulla sit amet mattis massa, eu finibus diam. Proin gravida mollis 
        scelerisque. Fusce convallis porttitor ligula eu ullamcorper. Vivamus rhoncus facilisis hendrerit. 
        Aenean rhoncus tortor odio, quis tristique nisl tristique quis.</p>
      {/*GARBAGE <button onClick={handleTest}></button><br/> */}
      {/*GARBAGE <button onClick={logoutTest}></button> */}
    </div>
  )
}

export default Home;