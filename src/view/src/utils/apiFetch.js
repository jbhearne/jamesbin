

const dataUrl = 'http://localhost:3000'

export const apiFetch = async (endpoint, token) => {
  const headers = token ? {
    'content-type': 'application/json',
    'Authorization': token,
    'Test': 'TEST'
  } : {
    'content-type': 'application/json',
    'Test': 'TEST2'
  }

  const resolve = await fetch(dataUrl + endpoint, {
    withCredentials: true,
    credentials: 'include',
    //mode: 'no-cors',
    headers: headers,
  });
  const data = await resolve.json();
  return data;
}

export const apiPost = async (endpoint, body) => {
  console.log(body)
  const postData = await fetch(dataUrl + endpoint, {
    method: 'POST',
    withCredentials: true,
    credentials: 'include', 
    mode: 'cors',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const jsonData = await postData.json()
  //for (let pair of postData.headers.entries()) {
    //console.log(jsonData);
 //}

  
  //postData.headers.entries().forEach(entry => console.log(entry))
  //console.log(moreData)
  //const data = await resolve.json();
  //console.log(resolve)
  return jsonData;
}


//IDEA these were interpreted from a web post
export const setToken = (response) => {
    const expiresAt = Date.now() + parseInt(response.expiresIn);

    localStorage.setItem('id_token', response.token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt));
}

export const logout = () => {
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

