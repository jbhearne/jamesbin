
import dataUrl from "./dataUrl";
//TODO move token to this file const token = localStorage.getItem("id_token");

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

export const apiPost = async (endpoint, body, token) => {
  console.log(body)
  const headers = token ? {
    'content-type': 'application/json',
    'Authorization': token,
    'Test': 'JWT present'
  } : {
    'content-type': 'application/json',
    'Test': 'No JWT'
  }

  const postData = await fetch(dataUrl + endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  });
  const jsonData = await postData.json()

  return jsonData;
}

export const multiPost = async (endpoint, arr, i, token) => {
  //testlog console.log('top of multi ' + (parseInt(Date.now()) - 1678800000000))
  if (i === arr.length) return
  await apiPost(endpoint, arr[i], token)
  await multiPost(endpoint, arr, i + 1, token)
  //testlog console.log('bottom of multi ' + (parseInt(Date.now()) - 1678800000000))
}

export const apiPut = async (endpoint, body, token) => {
  const headers = token ? {
    'content-type': 'application/json',
    'Authorization': token,
    'Test': 'JWT present'
  } : {
    'content-type': 'application/json',
    'Test': 'No JWT'
  }

  const putData = await fetch(dataUrl + endpoint, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(body)
  });
  const jsonData = await putData.json()

  return jsonData;
}

export const apiDelete = async (endpoint, token) => {
  const headers = token ? {
    'content-type': 'application/json',
    'Authorization': token,
    'Test': 'JWT present'
  } : {
    'content-type': 'application/json',
    'Test': 'No JWT'
  }

  const deleteData = await fetch(dataUrl + endpoint, {
    method: 'DELETE',
    headers: headers,
  });
  const jsonData = await deleteData.json()

  return jsonData;
}

/*GARBAGE
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
*/


