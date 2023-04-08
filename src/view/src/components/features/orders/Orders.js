
//imports
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { selectOrders, fetchOrders, fetchItems, selectOrderItems } from './ordersSlice'
import { selectUser } from '../user/userSlice';
import { page } from '../../../utils/page'
import Order from './order/Order'
import OrderItem from './order/OrderItem'
import './orders.css'

//Component for displaying the users previous orders
function Orders({ test, test2 }) {
  //props: testing how props are passed through from the LoggedIn component.

  //Component state used to track display based info not needed for redux
  const [isOrderItems, setIsOrderItems] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [numItems, setNumItems] = useState(10);
  
  //Redux constants
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const orders = useSelector(selectOrders);
  const orderItems = useSelector(selectOrderItems);

  //Fetch users order info from database
  useEffect(() => {
    dispatch(fetchOrders(user.id));
    setIsOrderItems(false);
  }, []);

  //builds page object for controling and displaying paginated arrays
  const p = page(pageNum, setPageNum, numItems, setNumItems, orders.length, 6)

  //Receives input and sets the page number accordingly 
  const handlePage = (e) => {
    p.setPage(e.target.value);
  }
  
  //Changes setIsOrderItems to true if a person clicks on an order line item.
  const handleOrderClick = async (orderId) => {
    await dispatch(fetchItems(orderId));
    setIsOrderItems(true);
  }

  //Render a s detailed view of a singal order. Used conditionally.
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
              //testlog console.log('item')
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

  //Render a list of a user's previous orders. If a user clicks on an order it will display a detailed view above the orders.
  return (
    <div className='main-orders'>
      <h2>ORDERS</h2>
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
            <button key={pNum} className='page-number' onClick={handlePage} value={pNum}>{pNum}</button>
          )
        })}
      </nav>
    </div>
  )
}

export default Orders;