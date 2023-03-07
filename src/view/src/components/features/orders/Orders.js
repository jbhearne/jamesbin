
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { selectOrders, fetchOrders, fetchItems, selectOrderItems } from './ordersSlice'
import { selectUser } from '../user/userSlice';
import Order from './order/Order'
import OrderItem from './order/OrderItem'

function Orders({ test, test2 }) {
  const [isOrderItems, setIsOrderItems] = useState(false)
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  useEffect(() => {
    dispatch(fetchOrders(user.id));
    setIsOrderItems(false);
  }, []);

  const orders = useSelector(selectOrders);
  

  const handleOrderClick = async (orderId) => {
    await dispatch(fetchItems(orderId));
    setIsOrderItems(true);
  }

  const orderItems = useSelector(selectOrderItems);

  const renderOrderItems = () => {
    return (
      <div>
        <h4>Order Number {orderItems[0].orderId}</h4>
        <button onClick={() => setIsOrderItems(false)}>close</button>
        <h5>
          <span>{new Date(orders.filter(order => order.id === orderItems[0].orderId)[0].dateCompleted).toDateString()}</span>
          <span>{orders.filter(order => order.id === orderItems[0].orderId)[0].amount}</span>
        </h5>
        <table>
          <thead>
            <tr>
              <th>Product#</th>
              <th>Product</th>
              <th>Price</th>
              <th>QTY.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map(item => {
              console.log('item')
              return (
                <OrderItem key={item.id} item={item} />
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <h2>ORDERS</h2>
      <p>{test+test2}</p>
      {isOrderItems && renderOrderItems()}
      <table>
        <thead>
          <tr>
            <th>Order#</th>
            <th>Date Placed</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            if (order.dateCompleted) {
              return (
                <Order  key={order.id} order={order} handleOrderClick={handleOrderClick} />
              )
            }
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Orders;