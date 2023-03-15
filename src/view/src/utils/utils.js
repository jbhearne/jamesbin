
export const subtotal = (price, qty) => {
  const numPrice = Math.trunc(Number(price.replace(/[^0-9.-]+/g,"")) * 100) / 100;
  return '$' + (numPrice * parseInt(qty));
}