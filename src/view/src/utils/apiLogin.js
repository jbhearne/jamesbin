//import api URL
import dataUrl from "./dataUrl";

//IDEA these were interpreted from a web post

//Function to take a token object receive from the server and store it in localStorage along with expiration info
export const setToken = (response) => {
  const expiresAt = Date.now() + parseInt(response.expiresIn);

  localStorage.setItem('id_token', response.token);
  localStorage.setItem("expires_at", JSON.stringify(expiresAt));
}

//Function to remove the JWT from localStorage when loggin out.
export const logoutToken = () => {
  localStorage.removeItem('id_token');
  localStorage.removeItem('expires_at');
}

//Determines if a JWT has been set and if it is current
export const isLoggedIn = () => {
  const exp = localStorage.getItem('expires_at');
  const expiresAt = JSON.parse(exp);
  return Date.now().valueOf() < expiresAt;
}

//Determines the oposite of isLoggedIn
export const isLoggedOut = () => {
  return !isLoggedIn();
}

//POSTs a login object to the server and receives a JWT if successful. Then uses setToken to store the JWT.
export const fetchLogin = async (body) => {
  console.log(body)
  const data = await fetch(dataUrl + '/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const jwtResponse = await data.json();
  setToken(jwtResponse);
  //return isLoggedIn();
  return {
    msg: jwtResponse.msg,
    success: jwtResponse.success,
  }
}