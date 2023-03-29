import Cart from '../../cart/Cart'
import Billing from './billingAndDelivery/Billing';
import Delivery from './billingAndDelivery/Delivery';
//GARBAGE import CreditCard from './billingAndDelivery/CreditCard';
import CheckoutForm from './CheckoutForm';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
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
//GARBAGE import { apiPost, apiFetch } from '../../../../utils/apiFetch';
import "./checkout.css"

const stripePromise = loadStripe('pk_test_51MoFPfLe0FPU1SNMz0VpDaaRmWnvEfIfninY8srdIqBdupcQCbNuI0A1x5EZN2N05S3wzCBDGaI4SDw3lQy1XlTI00EN5MFzvC');

function Checkout({ intent }) {
  
  /*GARBAGE const stripe = await loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
  var elements = stripe.elements({
    clientSecret: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
  });
  var paymentElement = elements.create('payment');
  console.log(paymentElement)*/
  useEffect(() => {
    //console.log('useEffect')
    dispatch(fetchCheckout());
    //dispatch(fetchCart({ id: user.id }));
  }, [])
  /*GARBAGE const clientSecret = (async () => {
    const token = localStorage.getItem("id_token");
    const secretPromise = await apiFetch('/secret', token)
    return secretPromise
    // Render the form using the clientSecret
  })();*/
  /*GARBAGE const token = localStorage.getItem("id_token");
  const secretPromise = apiFetch('/secret', token)*/
  //console.log('oprtions' + clientSecret)
  const appearance = {
    theme: 'stripe',

    rules: {
      '.Tab': {
        border: '.2rem solid #000000',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02)',
      },
      '.Input': {
        border: '.2rem solid #000000',
        fontSize: '1rem',
        padding: '.2rem',
      },
    },
  
    variables: {
      colorPrimary: '#000000',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '2px',
    }
  };

  const options = {
    // passing the client secret obtained from the server
    clientSecret: intent.client_secret,
    appearance: appearance
  };
  /*GARBAGE useEffect(() => {
    //console.log('useEffect')
    (async () => {
    const token = localStorage.getItem("id_token");
    const clientSecret = await apiFetch('/secret', token)
    options.clientSecret = clientSecret;})();
    //dispatch(fetchCart({ id: user.id }));
  }, []) */

  const dispatch = useDispatch();
  //GARBAGE const navigate = useNavigate();
  //GARBAGE const isLoading = useSelector(selectIsOrderLoading);
  const user = useSelector(selectUser);
  //testlog console.log('before')
  useEffect(() => {
    //testlog console.log('useEffect')
    dispatch(fetchCheckout());
    //testlog dispatch(fetchCart({ id: user.id }));
  }, [])

  useEffect(() => {
    //testlog console.log('useEffect')
    if (user.id) {
      dispatch(fetchCart({ id: user.id, cart: [] }));
    }  
  }, [user.id])
  //testlog console.log('after')

  const checkoutOrder = useSelector(selectCheckoutOrder);
  const ccPlaceholder = useSelector(selectCcPlaceholder);
  const useDefaultBilling = useSelector(selectUseDefaultBilling);
  const useDefaultDelivery = useSelector(selectUseDefaultDelivery);
  const cart = useSelector(selectCart)
  //testlog console.log('checkOutOrder')
  //testlog console.log(checkoutOrder)

  const handleComplete = async (e) => {
    /*GARBAGE const headers = {
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": 1,
      "Content-Type": "application/x-www-form-urlencoded",
      //"Access-Control-Allow-Origin": ["http://localhost:3002", "http://localhost:3000", "https://checkout.stripe.com"],
      "test": "HELLO",
    }*/
    //GARBAGE const body = { cart: cart }

    //GARBAGE const xhr = new XMLHttpRequest();
    //GARBAGE xhr.open("POST", 'http://localhost:3000/create-checkout-session', true);

    //GARBAGE Send the proper header information along with the request
    //GARBAGE xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //GARBAGE xhr.setRequestHeader("Sec-Fetch-User", "?1");
    //GARBAGE xhr.setRequestHeader("Upgrade-Insecure-Requests", 1);

    /*GARBAGE xhr.onreadystatechange = () => { // Call a function when the state changes.
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        // Request finished. Do processing here.
      }
    }*/
    //GARBAGE xhr.send("foo=bar&lorem=ipsum");
    /*GARBAGE await fetch("http://localhost:3000/create-checkout-session", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
      mode: 'no-cors',
    });*/

    //GARBAGE await apiPost("/create-checkout-session", { cart: cart } )
    
  

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
    //GARBAGE navigate('/order/complete')
    //GARBAGE window.open('https://google.com', '_self')
  }

  return (
    <div className='main-checkout'>
      <h2>Checkout</h2>
      <h3>{'Order Total: $' + checkoutOrder.total}</h3>
      <Cart controls={false} />
      {!checkoutOrder.billing ? (<p>loading</p>) : (<Billing billing={checkoutOrder.billing} />) /*FIXME why props are passing undefined?? I shouldn't need this conditional*/}
      {!checkoutOrder.delivery ? (<p>loading</p>) : (<Delivery delivery={checkoutOrder.delivery} />)}
      {/*GARBAGE  <CreditCard /> */}
      <div className="stripe-container" >
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm amount={intent.amount}/>
        </Elements>
      </div>
      {/*GARBAGE <form action="http://localhost:3000/create-checkout-session" method="POST" target='_blank'>*/}
      {/*GARBAGE  <button id='complete' onClick={handleComplete}>Complete Order</button> */}
      {/*GARBAGE </form>*/}
    </div>
  )

}

export default Checkout;