
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { selectOrders, fetchOrders, fetchItems, selectOrderItems } from './ordersSlice'
import { selectUser } from '../user/userSlice';
import { page } from '../../../utils/page'
import Order from './order/Order'
import OrderItem from './order/OrderItem'
import './orders.css'

function Orders({ test, test2 }) {
  const [isOrderItems, setIsOrderItems] = useState(false);
  
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  useEffect(() => {
    dispatch(fetchOrders(user.id));
    setIsOrderItems(false);
  }, []);

  const orders = useSelector(selectOrders);

  const [pageNum, setPageNum] = useState(1);
  const [numItems, setNumItems] = useState(10);
/*   const pageEnd = pageNum * numItems;
  const pageStart = pageEnd - numItems;
  const maxPage = Math.ceil(orders.length / numItems); */
  const p = page(pageNum, setPageNum, numItems, setNumItems, orders.length, 6)


  const handlePage = (e) => {
    p.setPage(e.target.value);
  }
  
  const handleOrderClick = async (orderId) => {
    await dispatch(fetchItems(orderId));
    setIsOrderItems(true);
  }

  const orderItems = useSelector(selectOrderItems);

  const renderOrderItems = () => {
    return (
      <div className='order-details'>
        <h4>Order Number {orderItems[0].orderId}</h4>
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
        <button onClick={() => setIsOrderItems(false)}>close</button>
      </div>
    )
  }

  return (
    <div className='main-orders'>
      <h2>ORDERS</h2>
      <p>{test+test2}</p>
      {isOrderItems && renderOrderItems()}
      <table className='orders-table'>
        <thead>
          <tr>
            <th>Order#</th>
            <th>Date Placed</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.filter((item, idx) => idx >= p.pageStart && idx < p.pageEnd).map(order => {
            if (order.dateCompleted) {
              if (isOrderItems && order.id === orderItems[0].orderId) {
                return (
                  <Order className='highlight' key={order.id} order={order} handleOrderClick={handleOrderClick} />
                )
              } else {
                return (
                  <Order className='noHighlight' key={order.id} order={order} handleOrderClick={handleOrderClick} />
                )
              }
            }
          })}
        </tbody>
      </table>
      <nav>
        <span className='page-nav'><button onClick={handlePage} value='prev'>prev</button><span>{pageNum}</span><button onClick={handlePage} value='next'>next</button></span><br />
        {p.pageLinks.map(pNum =>  {
          return (
            <button className='page-number' onClick={handlePage} value={pNum}>{pNum}</button>
          )
        })}
      </nav>
    </div>
  )
}

export default Orders;