
//Import the api URL
import dataUrl from "./dataUrl";

//TODO move token to this file const token = localStorage.getItem("id_token");

//GETs data from the server API at the specified endpoint, if a token is supplied it sets the headers to inlcude Authorization. Returns the data from the api.
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

//POSTs data to the server API at the specified endpoint, if a token is supplied it sets the headers to inlcude Authorization.
//Returns the data/message from the api.
export const apiPost = async (endpoint, body, token) => {
  //testlog console.log(body)
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

//A recursive function that POSTs data to the server API at the specified endpoint for each item in an array, 
//if a token is supplied it sets the headers to inlcude Authorization. Returns the data/message from the api.
export const multiPost = async (endpoint, arr, i, token) => {
  //testlog console.log('top of multi ' + (parseInt(Date.now()) - 1678800000000))
  if (i === arr.length) return
  await apiPost(endpoint, arr[i], token)
  await multiPost(endpoint, arr, i + 1, token) //LEARNED - a recursive function is used to keep each POST synchronous. for loop would just keep running while waiting for each POST.
  //testlog console.log('bottom of multi ' + (parseInt(Date.now()) - 1678800000000))
}

//PUTs data to the server API at the specified endpoint to update the database, if a token is supplied it sets the headers to inlcude Authorization.
//Returns the data/message from the api.
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

//DELETEs data from the database using the server API at the specified endpoint, 
//if a token is supplied it sets the headers to inlcude Authorization. Returns the data/message from the api.
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



