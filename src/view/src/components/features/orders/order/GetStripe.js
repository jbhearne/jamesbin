import { apiFetch } from "../../../../utils/apiFetch";
import Checkout from "./Checkout";
import { useState, useEffect } from "react";

function GetStripe () {
  const [intent, setIntent] = useState(); //??? it works, but not sure if this is how to pass a sectret.
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("id_token");
      const intentAPI = await apiFetch('/secret', token);
      //testlog console.log(intentAPI.amount)
      setIntent(intentAPI)
    })();
  }, [])
  
  //testlog console.log(intent)
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
    
  return loader()
}

export default GetStripe;