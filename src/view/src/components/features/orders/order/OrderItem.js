

function OrderItem({ item }) {

  return (
    <tr>
      <td>{item.product_id}</td> 
      <td>{item.name}</td> 
      <td>{item.price}</td> 
      <td>{item.quantity}</td> 
      <td>{item.subtotal}</td>
    </tr>
  )
}

export default OrderItem;