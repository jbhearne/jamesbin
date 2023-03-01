import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectCart, fetchCart } from './cartSlice';
import { selectUser } from '../user/userSlice';
import Item from './Item/Item';
import { apiPost } from '../../../utils/apiFetch';

function Cart() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser);
  const cart = useSelector(selectCart);

  useEffect(() => {
    //console.log('useeffect')
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
    }
    dispatch(fetchCart(user.id))
  }, [])

  
  console.log(cart)
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>QTY.</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => {
            return (
              <Item key={item.id} item={item} />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Cart;