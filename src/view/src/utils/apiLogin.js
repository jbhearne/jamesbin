import dataUrl from "./dataUrl";

//IDEA these were interpreted from a web post

export const setToken = (response) => {
  const expiresAt = Date.now() + parseInt(response.expiresIn);

  localStorage.setItem('id_token', response.token);
  localStorage.setItem("expires_at", JSON.stringify(expiresAt));
}

export const logoutToken = () => {
  localStorage.removeItem('id_token');
  localStorage.removeItem('expires_at');
}

export const isLoggedIn = () => {
  const exp = localStorage.getItem('expires_at');
  const expiresAt = JSON.parse(exp);
  return Date.now().valueOf() < expiresAt;
}

export const isLoggedOut = () => {
  return !isLoggedIn();
}

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
  return isLoggedIn();
}