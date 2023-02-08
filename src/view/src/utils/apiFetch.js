

const dataUrl = 'http://localhost:3000'

export const apiFetch = async endpoint => {
  const resolve = await fetch(dataUrl + endpoint);
  const data = await resolve.json();
  return data;
}