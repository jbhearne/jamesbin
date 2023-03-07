import { useDispatch } from "react-redux";
import { deleteUserCartItem, removeItemFromCart } from "../cartSlice";

function Item({ item }) {

  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteUserCartItem(id));
    dispatch(removeItemFromCart(id));
  }

  return (
    <tr>
      <td>{item.productName}</td>
      <td>{item.price}</td>
      <td>{item.quantity}</td>
      <td>*</td>
      <td><button onClick={() => handleDelete(item.id)}>x</button></td>
    </tr>
  )
}

export default Item;