


export const syncCart = (cart) => {
  console.log(Date.now())
  const length = new Promise()
  const token = localStorage.getItem("id_token");
  if (cart.length > 0) {
    const localItems = cart.filter(item => item.id < 0);
    if (localItems.length > 0) {
      localItems.forEach(async item => {
        await apiPost('/cart', { 
          productId: item.productId,
          quantity: item.quantity
        }, token)
      })
    }
    const length = new Promise(res => 0, 1)
  }
}

