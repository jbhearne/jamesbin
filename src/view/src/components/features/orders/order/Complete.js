//Imports
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { 
  selectCompleteOrder,
  selectCheckoutOrder,
  selectUseDefaultBilling,
  selectUseDefaultDelivery,
  fetchCompleteOrder,
  removeOrderItems,
  fetchCheckout,
 } from "../ordersSlice";
import { selectCart, removeCart, fetchCart } from "../../cart/cartSlice";
import Billing from "./billingAndDelivery/Billing";
import Delivery from "./billingAndDelivery/Delivery";
import { selectUser } from "../../user/userSlice";
import Item from "../../cart/Item/Item";

//Component for rendering an "Order Complete" screen.
function Complete() {

  //Redux constants
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const checkoutOrder = useSelector(selectCheckoutOrder);
  const useDefaultBilling = useSelector(selectUseDefaultBilling);
  const useDefaultDelivery = useSelector(selectUseDefaultDelivery);
  const cart = useSelector(selectCart);
  const completeOrder = useSelector(selectCompleteOrder);


  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("redirect_status") !== "succeeded") {  //TODO store this info and use instead of redirect_status payment_intent=pi_RANDOMCHARS&payment_intent_client_secret=pi_RANDOMCHARS_secret_RANDOMCHARSmm
      navigate('/orders')
    }
  }, [])

  useEffect(() => {
    //testlog console.log('useEffect')
    if (user.id) {
      dispatch(fetchCart({ id: user.id, cart: [] }));
      dispatch(fetchCheckout());
    }  
  }, [user.id]);
  //testlog console.log('after')

  //Builds a completeCheckout object and uses that to complete the order on the database, removes related Redux state.
  useEffect(() => {
    if (cart.length > 0 && checkoutOrder.billing) {
      //testlog console.log(checkoutOrder)
      //testlog console.log('complete')
        const completeCheckout = { //TODO Redux state gets reset after Stripe redirection, and this info is likely lost unless it is set in elsewhere.
          useDefaultBilling: useDefaultBilling,
          useDefaultDelivery: useDefaultDelivery,
          billing: checkoutOrder.billing,
          delivery: checkoutOrder.delivery,
        }
        if (true) {
          dispatch(fetchCompleteOrder({ completeCheckout: completeCheckout, cart: cart }));
          dispatch(removeCart());
          dispatch(removeOrderItems());
        }
    }
  }, [cart, checkoutOrder]);

  //Renders the Complete element 
  return (
    <div className="main-complete">
      <h2>Order #{completeOrder.id} Complete!</h2>
      <p>{new Date(completeOrder.dateCompleted).toDateString()}</p>
      <h3>{'Order Total: $' + completeOrder.total}</h3>
      {!completeOrder.cart ? (<p>loading</p>) : (
      <div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>QTY.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {completeOrder.cart.map(item => {
              return (
                <Item key={item.id} item={item} controls={false} />
              )
            })}
          </tbody>
        </table>
      </div>)}
      <div className="billing-delivery">
        {!completeOrder.delivery ? (<p>loading</p>) : (<Delivery delivery={completeOrder.delivery} controls={false} />)}
        {!completeOrder.billing ? (<p>loading</p>) : (<Billing billing={completeOrder.billing} controls={false} />)}
      </div>
    </div>
  )
}

export default Complete;