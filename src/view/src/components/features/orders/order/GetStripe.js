//imports
import { apiFetch } from "../../../../utils/apiFetch";
import Checkout from "./Checkout";
import { useState, useEffect } from "react";


//Component that gets a secret from Stripe and passed it to the Checkout component.
function GetStripe () {
  
  //React state for stroring the intent and passing it as prop. Definitely not a Redux state
  const [intent, setIntent] = useState(); //??? it works, but not sure if this is how to pass a sectret. Maybe I shoud set the state as a boolean haveIntent and store the actual secret in an regular const?
  
  //Fetch the Stripe secret from the server
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("id_token");
      const intentAPI = await apiFetch('/secret', token);
      //testlog console.log(intentAPI.amount)
      setIntent(intentAPI)
    })();
  }, []);
  
  //testlog console.log(intent)

  //Returns the Checkout element if the secret has loaded
  const loader = () => {
    if (typeof intent?.client_secret === 'string') {
      return (
        <Checkout intent={intent}></Checkout>
      )
    } else {
      return (
        <p>loading {typeof clientSecret}</p>
        
      )
    }
  }
  
  //Renders the element
  return loader();
}

export default GetStripe;