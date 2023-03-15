import { useSelector } from "react-redux";
import { selectCompleteOrder } from "../ordersSlice";
import Billing from "./billingAndDelivery/Billing";
import Delivery from "./billingAndDelivery/Delivery";
import Cart from "../../cart/Cart";
import Item from "../../cart/Item/Item";

function Complete() {

  const completeOrder = useSelector(selectCompleteOrder);

  return (
    <div>
      <h2>Order #{completeOrder.id} Complete!</h2>
      <h3>{'Order Total: $' + completeOrder.total}</h3>
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
            {completeOrder.cart.map(item => {
              return (
                <Item key={item.id} item={item} controls={false} />
              )
            })}
          </tbody>
        </table>
      </div>
      {!completeOrder.delivery ? (<p>loading</p>) : (<Delivery delivery={completeOrder.delivery} controls={false} />)}
      {!completeOrder.billing ? (<p>loading</p>) : (<Billing billing={completeOrder.billing} controls={false} />) /*FIXME why props are passing undefined?? I shouldn't need this conditional*/}
    </div>
  )
}

export default Complete;