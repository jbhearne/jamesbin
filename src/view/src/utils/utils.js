
export const subtotal = (price, qty) => {
  const numPrice = Number(price.replace(/[^0-9.-]+/g,""));
  return '$' + Math.trunc((numPrice * parseInt(qty)) * 100) / 100;
}