

function Item({ item }) {


  return (
    <tr>
      <td>{item.productName}</td><td>{item.price}</td><td>{item.quantity}</td><td>*</td>
    </tr>
  )
}

export default Item;