import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { 
  selectCompleteOrder,
  selectCheckoutOrder,
  selectUseDefaultBilling,
  selectUseDefaultDelivery,
  fetchCompleteOrder,
  removeCheckoutOrder,
  removeOrderItems,
  fetchCheckout,
 } from "../ordersSlice";
import { selectCart, removeCart, fetchCart } from "../../cart/cartSlice";
import Billing from "./billingAndDelivery/Billing";
import Delivery from "./billingAndDelivery/Delivery";
import { selectUser } from "../../user/userSlice";
import Cart from "../../cart/Cart";
import Item from "../../cart/Item/Item";

function Complete() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  useEffect(() => {
    //console.log('useEffect')
    if (user.id) {
      dispatch(fetchCart({ id: user.id, cart: [] }));
      dispatch(fetchCheckout());
    }  
  }, [user.id]);
  //console.log('after')

  const checkoutOrder = useSelector(selectCheckoutOrder);
  //const ccPlaceholder = useSelector(selectCcPlaceholder);
  const useDefaultBilling = useSelector(selectUseDefaultBilling);
  const useDefaultDelivery = useSelector(selectUseDefaultDelivery);
  const cart = useSelector(selectCart)
  const completeOrder = useSelector(selectCompleteOrder);
  useEffect(() => {
    if (cart.length > 0 && checkoutOrder.billing) {
      console.log(checkoutOrder)
      console.log('complete')
        const completeCheckout = {
          useDefaultBilling: useDefaultBilling,
          useDefaultDelivery: useDefaultDelivery,
          billing: checkoutOrder.billing,
          delivery: checkoutOrder.delivery,
          //ccPlaceholder: ccPlaceholder,
        }
        if (true) {
          dispatch(fetchCompleteOrder({ completeCheckout: completeCheckout, cart: cart }));
          dispatch(removeCart());
          //dispatch(removeCheckoutOrder());
          dispatch(removeOrderItems());
          //navigate('/order/complete')
          //window.open('https://google.com', '_self')
        }
    }
  }, [cart, checkoutOrder]);

  //4242424242424242


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
        {!completeOrder.billing ? (<p>loading</p>) : (<Billing billing={completeOrder.billing} controls={false} />) /*FIXME why props are passing undefined?? I shouldn't need this conditional*/}
      </div>
    </div>
  )
}

export default Complete;