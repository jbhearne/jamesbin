//imports
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';

//URL used by Stripe to redirect after the payment is processed
const deployUrl = 'https://gentle-yoke-fish.cyclic.app';
const builtLocalUrl = 'http://localhost:3000';
const servedLocalUrl = 'http://localhost:3002';

//Component used by Stripe to render PaymentElement
const CheckoutForm = ({ amount }) => {
  //props: amount is a prop passed from GetStripe component that has the amount to charge as determined on the server. Can be used to check to make sure that the amount being charge matches frontend.

  //Stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  //When the form is submitted it sends info to stripe and the redirects back to the website
  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        //return_url: 'http://localhost:3002/order/complete',  //TODO this might actually work now since I set the frontend routes
        //return_url: builtLocalUrl,
        //return_url: servedLocalUrl,
        return_url: deployUrl,
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      //TODO Add handling
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      //TODO add handling 
    }
  };

  //Renders the Stripe PaymentElement
  return (
    <form className='stripe-pay' onSubmit={handleSubmit}>
      <p>{amount}</p>
      <PaymentElement />
      <button disabled={!stripe}>Submit</button>
    </form>
  )
};

export default CheckoutForm;