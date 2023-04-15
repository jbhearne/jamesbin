//imports
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../user/userSlice";
import { subtotal } from "../../../../utils/utils";
import { deleteUserCartItem, removeItemFromCart, fetchCart, selectCart, updateUserCartItem } from "../cartSlice";

//Component for rendering a line item representing a product in the cart
function Item({ item, controls }) {
  //props: item is the data that needs to be rendered, controls is a boolean to determine if the cart is only for display or has controls to delete or update the cart.

  //Redux constants
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);
  
  //Removes a cart item from database and Redux.
  const handleDelete = (id) => {
    dispatch(deleteUserCartItem(id));
    dispatch(removeItemFromCart(id));
  }

  //Change item quantity on database and then fetch the updated cart
  const handleUpdate = async (e) => {
    e.preventDefault()
    await dispatch(updateUserCartItem({ id: item.id, body: { productId: item.productId, quantity: e.target.quantity.value }}));
    dispatch(fetchCart({ id: user.id, cart: cart }));
  }

  //Render the a table row with the item data
  return (
    <tr className="cartItem">
      <td className="product-name">{item.productName}</td>
      <td>{item.price}</td>
      <td>{item.quantity}</td>
      <td>{subtotal(item.price, item.quantity)}</td>
      {controls && (<td>
        <form id='updateCart' onSubmit={handleUpdate}>
          <input id='quantity' className="qtyInput" aria-label="quantity-control" type='number' min="1" defaultValue={item.quantity}></input>
          <button className="update">update</button>
        </form>
        </td>)}
      {controls && (<td><button className="delete" onClick={() => handleDelete(item.id)}>☓</button></td>)} 
    </tr>
  )
}

export default Item;