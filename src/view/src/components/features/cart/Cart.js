import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useRef } from 'react';
import { selectCart, selectTempCartId, fetchCart, removeItemFromCart } from './cartSlice';
import { selectUser } from '../user/userSlice';
import Item from './Item/Item';
import { apiPost } from '../../../utils/apiFetch';

function Cart() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser);
  const cart = useSelector(selectCart);
  const dataFetchedRef = useRef(false);


  useEffect(() => {
    console.log('useEffect')
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    dispatch(fetchCart({ id: user.id, cart: cart }))
  }, []);

  
  //console.log(cart)
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