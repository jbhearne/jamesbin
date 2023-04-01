import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../user/userSlice";
//GARBAGE import { useNavigate } from "react-router-dom";
import { subtotal } from "../../../../utils/utils";
import { deleteUserCartItem, removeItemFromCart, /*GARBAGE addItemToCart, */ fetchCart, selectTempCartId, selectCart, updateUserCartItem } from "../cartSlice";

function Item({ item, controls }) {

  const dispatch = useDispatch();
  //GARBAGE const navigate = useNavigate();

  const handleDelete = (id) => {
    dispatch(deleteUserCartItem(id));
    dispatch(removeItemFromCart(id));
  }

  //GARBAGE const tempCartId = useSelector(selectTempCartId);
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);

  const handleUpdate = async (e) => {
    e.preventDefault()
    await dispatch(updateUserCartItem({ id: item.id, body: { productId: item.productId, quantity: e.target.quantity.value }}));
    /*GARBAGE dispatch(addItemToCart({
      id: tempCartId,
      productName: item.productName,
      productId: item.productId,
      orderId: -1,
      price: item.price,
      quantity: e.target.quantity.value,
    }))*/
    //GARBAGE await dispatch(deleteUserCartItem(item.id));
    //GARBAGE await dispatch(removeItemFromCart(item.id));
    dispatch(fetchCart({ id: user.id, cart: cart }));
  }

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
      {/*GARBAGE  <td>{item.id}</td> */}
    </tr>
  )
}

export default Item;