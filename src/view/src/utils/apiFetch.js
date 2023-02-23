

const dataUrl = 'http://localhost:3000'

export const apiFetch = async (endpoint, token) => {
  const headers = token ? {
    'content-type': 'application/json',
    'Authorization': token,
    'Test': 'JWT present'
  } : {
    'content-type': 'application/json',
    'Test': 'No JWT'
  }

  const resolve = await fetch(dataUrl + endpoint, {
    headers: headers,
  });
  const data = await resolve.json();
  return data;
}

export const apiPost = async (endpoint, body) => {
  console.log(body)
  const postData = await fetch(dataUrl + endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const jsonData = await postData.json()

  return jsonData;
}


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



