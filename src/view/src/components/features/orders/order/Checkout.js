import Cart from '../../cart/Cart'
import Billing from './billingAndDelivery/Billing';
import Delivery from './billingAndDelivery/Delivery';
import CreditCard from './billingAndDelivery/CreditCard';
import { 
  selectCheckoutOrder, 
  fetchCheckout, 
  selectIsOrderLoading, 
  selectCcPlaceholder,
  selectUseDefaultBilling,
  selectUseDefaultDelivery,
  fetchCompleteOrder,
  removeOrderItems,
  removeCheckoutOrder,
 } from '../ordersSlice';
import { fetchCart, removeCart, selectCart } from '../../cart/cartSlice';
import { selectUser } from '../../user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../../../../utils/apiFetch';


function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsOrderLoading);
  const user = useSelector(selectUser);
  //console.log('before')
  useEffect(() => {
    //console.log('useEffect')
    dispatch(fetchCheckout());
    //dispatch(fetchCart({ id: user.id }));
  }, [])

  useEffect(() => {
    //console.log('useEffect')
    if (user.id) {
      dispatch(fetchCart({ id: user.id, cart: [] }));
    }  
  }, [user.id])
  //console.log('after')

  const checkoutOrder = useSelector(selectCheckoutOrder);
  const ccPlaceholder = useSelector(selectCcPlaceholder);
  const useDefaultBilling = useSelector(selectUseDefaultBilling);
  const useDefaultDelivery = useSelector(selectUseDefaultDelivery);
  const cart = useSelector(selectCart)
  //console.log('checkOutOrder')
  //console.log(checkoutOrder)

  const handleComplete = async (e) => {
    
    const completeCheckout = {
      useDefaultBilling: useDefaultBilling,
      useDefaultDelivery: useDefaultDelivery,
      billing: checkoutOrder.billing,
      delivery: checkoutOrder.delivery,
      ccPlaceholder: ccPlaceholder,
    }

    dispatch(fetchCompleteOrder({ completeCheckout: completeCheckout, cart: cart }));
    dispatch(removeCart());
    dispatch(removeCheckoutOrder());
    dispatch(removeOrderItems());
    navigate('/order/complete')
  }

  return (
    <div>
      <h2>Checkout</h2>
      <h3>{'Order Total: $' + checkoutOrder.total}</h3>
      <Cart controls={false} />
      {!checkoutOrder.billing ? (<p>loading</p>) : (<Billing billing={checkoutOrder.billing} />) /*FIXME why props are passing undefined?? I shouldn't need this conditional*/}
      {!checkoutOrder.delivery ? (<p>loading</p>) : (<Delivery delivery={checkoutOrder.delivery} />)}
      <CreditCard />
      <button id='complete' onClick={handleComplete}>Complete Order</button>
    </div>
  )
}

export default Checkout;