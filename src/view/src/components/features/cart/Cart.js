import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectCart, selectTempCartId, fetchCart, removeItemFromCart } from './cartSlice';
import { selectUser } from '../user/userSlice';
import Item from './Item/Item';
import { apiPost } from '../../../utils/apiFetch';

function Cart({ controls }) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser);
  const cart = useSelector(selectCart);
  const dataFetchedRef = useRef(false);
  const navigate = useNavigate();
  //console.log('before use cart')
  useEffect(() => {
    //console.log('useEffect')
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    dispatch(fetchCart({ id: user.id, cart: cart }))
  }, []);
  //console.log('after use cart')
  
  //console.log(cart)
  return (
    <div>
      <h2>Shopping Cart</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>QTY.</th>
            <th>Subtotal</th>
            {controls && (<th>Change QTY</th>)}
            {controls && (<th>Delete</th>)}
          </tr>
        </thead>
        <tbody>
          {cart.map(item => {
            return (
              <Item key={item.id} item={item} controls={controls} />
            )
          })}
        </tbody>
      </table>
      {(controls && cart.length > 0) && (<button onClick={() => navigate('/order/checkout')}>Checkout</button>)}
    </div>
  )
}

export default Cart;