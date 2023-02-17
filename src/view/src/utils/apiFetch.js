

const dataUrl = 'http://localhost:3000'

export const apiFetch = async endpoint => {
  const resolve = await fetch(dataUrl + endpoint, {
    withCredentials: true,
    credentials: 'include',
    //mode: 'no-cors',
    headers: {
      'content-type': 'application/json',
      
    }
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
  for (let pair of postData.headers.entries()) {
    console.log(jsonData);
  }
  //postData.headers.entries().forEach(entry => console.log(entry))
  //console.log(moreData)
  //const data = await resolve.json();
  //console.log(resolve)
  //return data;
}