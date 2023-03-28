import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../user/userSlice";
import { useNavigate } from "react-router-dom";
import { subtotal } from "../../../../utils/utils";
import { deleteUserCartItem, removeItemFromCart, addItemToCart, fetchCart, selectTempCartId, selectCart, updateUserCartItem } from "../cartSlice";

function Item({ item, controls }) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = (id) => {
    dispatch(deleteUserCartItem(id));
    dispatch(removeItemFromCart(id));
  }

  const tempCartId = useSelector(selectTempCartId);
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);

  const handleUpdate = async (e) => {
    e.preventDefault()
    await dispatch(updateUserCartItem({ id: item.id, body: { productId: item.productId, quantity: e.target.quantity.value }}));
    /*dispatch(addItemToCart({
      id: tempCartId,
      productName: item.productName,
      productId: item.productId,
      orderId: -1,
      price: item.price,
      quantity: e.target.quantity.value,
    }))*/
    //await dispatch(deleteUserCartItem(item.id));
    //await dispatch(removeItemFromCart(item.id));
    dispatch(fetchCart({ id: user.id, cart: cart }));
  }

  return (
    <tr className="cartItem">
      <td>{item.productName}</td>
      <td>{item.price}</td>
      <td>{item.quantity}</td>
      <td>{subtotal(item.price, item.quantity)}</td>
      {controls && (<td>
        <form id='updateCart' onSubmit={handleUpdate}>
          <input id='quantity' className="qtyInput" aria-label="quantity-control" type='number' min="1" defaultValue={item.quantity}></input>
          <button>update</button>
        </form>
        </td>)}
      {controls && (<td><button onClick={() => handleDelete(item.id)}>x</button></td>)}
      <td>{item.id}</td>
    </tr>
  )
}

export default Item;