//imports
import Cart from '../../cart/Cart'
import Billing from './billingAndDelivery/Billing';
import Delivery from './billingAndDelivery/Delivery';
import CheckoutForm from './CheckoutForm';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import { 
  selectCheckoutOrder, 
  fetchCheckout, 
 } from '../ordersSlice';
import { fetchCart } from '../../cart/cartSlice';
import { selectUser } from '../../user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import "./checkout.css"


//TODO: It is a public key, but maybe should keep the key somewhere less obvious.
//Creates a stripe promise that eventually returns the stripe object used to create elements for take CC info
const stripePromise = loadStripe('pk_test_51MoFPfLe0FPU1SNMz0VpDaaRmWnvEfIfninY8srdIqBdupcQCbNuI0A1x5EZN2N05S3wzCBDGaI4SDw3lQy1XlTI00EN5MFzvC');

function Checkout({ intent }) {
  //props: intent is for passing the stripe secret from the sever into the stripe elements, also has the value to be charged as determined on server from the database.
  
  //testlog console.log(paymentElement)*/
  
  //Redux constants
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const checkoutOrder = useSelector(selectCheckoutOrder);
  
  //Gets the checkout data from the database
  useEffect(() => {
    //testlog console.log('useEffect')
    dispatch(fetchCheckout());
    //testlog dispatch(fetchCart({ id: user.id }));
  }, [])

  //testlog console.log('oprtions' + clientSecret)

  //appearance object used to style Stripe elements 
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

  //options object used to setup Stripe elements 
  const options = {
    // passing the client secret obtained from the server
    clientSecret: intent.client_secret,
    appearance: appearance
  };

  //testlog console.log('before')

  //gets the current shopping cart
  useEffect(() => {
    //testlog console.log('useEffect')
    if (user.id) {
      dispatch(fetchCart({ id: user.id, cart: [] }));
    }  
  }, [user.id])

  //testlog console.log('after')
  //testlog console.log('checkOutOrder')
  //testlog console.log(checkoutOrder)

  //Renders the checkout form and Stripe Eleements
  return (
    <div className='main-checkout'>
      <h2>Checkout</h2>
      <h3>{'Order Total: $' + checkoutOrder.total}</h3>
      <Cart controls={false} />
      {!checkoutOrder.billing ? (<p>loading</p>) : (<Billing billing={checkoutOrder.billing} />) /*LEARNED why props are passing undefined?? I shouldn't need this conditional-> checkoutOrder is part of state, but checkoutOrder.billing is not so it does not update when the billing object is added to checkoutOrder*/}
      {!checkoutOrder.delivery ? (<p>loading</p>) : (<Delivery delivery={checkoutOrder.delivery} />)}
      <div className="stripe-container" >
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm amount={intent.amount}/>
        </Elements>
      </div>
    </div>
  )

}

export default Checkout;