import { apiFetch } from "../../../../utils/apiFetch";
import Checkout from "./Checkout";
import { useState, useEffect } from "react";

function GetStripe () {
  const [intent, setIntent] = useState();
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("id_token");
      const intentAPI = await apiFetch('/secret', token);
      console.log(intentAPI.amount)
      setIntent(intentAPI)
    })();
  }, [])
  
  console.log(intent)
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