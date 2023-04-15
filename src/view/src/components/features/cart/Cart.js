import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectCart, fetchCart } from './cartSlice';
import { selectUser, selectIsloggedIn } from '../user/userSlice';
import Item from './Item/Item';

//Component for rendering the shopping cart
function Cart({ controls }) {

  //Set Redux constant
  const dispatch = useDispatch()
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsloggedIn);
  const cart = useSelector(selectCart);

  //Ref used to check if data has been fetched
  const dataFetchedRef = useRef(false);

  const navigate = useNavigate();

  //testlog console.log('before use cart')

  //Syncronize local cart with database 
  useEffect(() => {
    //testlog console.log('useEffect')

    //conditional used make sure the cart syncronization only runs once so local items don't get multiplied on the database (React.Strictmode runs hooks twice during developement)
    if (dataFetchedRef.current || !isLoggedIn) return;
    dataFetchedRef.current = true;
    dispatch(fetchCart({ id: user.id, cart: cart }))
  }, []);
  //testlog console.log('after use cart')
  //testlog console.log(cart)

  //Render the cart
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