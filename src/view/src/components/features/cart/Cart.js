import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectCart, /*GARBAGE  selectTempCartId, */ fetchCart, /*GARBAGE  removeItemFromCart */ } from './cartSlice';
import { selectUser, selectIsloggedIn } from '../user/userSlice';
import Item from './Item/Item';
//GARBAGE import { apiPost } from '../../../utils/apiFetch';

function Cart({ controls }) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsloggedIn);
  const cart = useSelector(selectCart);
  const dataFetchedRef = useRef(false);
  const navigate = useNavigate();
  //testlog console.log('before use cart')
  useEffect(() => {
    //testlog console.log('useEffect')
    if (dataFetchedRef.current || !isLoggedIn) return;
    dataFetchedRef.current = true;
    dispatch(fetchCart({ id: user.id, cart: cart }))
  }, []);
  //testlog console.log('after use cart')
  
  //testlog console.log(cart)
  return (
    <div className='shopping-cart'>
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
      {(controls && cart.length > 0) && (<button className='checkout' onClick={() => navigate('/order/checkout')}>Checkout</button>)}
    </div>
  )
}

export default Cart;