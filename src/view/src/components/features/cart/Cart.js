import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectCart, fetchCart } from './cartSlice';
import { selectUser } from '../user/userSlice';
import Item from './Item/Item';

function Cart() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser);

  useEffect(() => {
    console.log('useeffect')
    dispatch(fetchCart(user.id))
  }, [])

  const cart = useSelector(selectCart);
  console.log(cart)
  return (
    <div>
      <ul>
        {cart.map(item => {
          return (
            <li key={item.id}><Item item={item} /></li>
          )
        })}
      </ul>
    </div>
  )
}

export default Cart;