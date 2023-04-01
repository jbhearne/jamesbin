

function OrderItem({ item }) {

  return (
    <tr>
      <td>{item.productId}</td> 
      <td>{item.productName}</td> 
      <td>{item.price}</td> 
      <td>{item.quantity}</td> 
      <td>{item.subtotal}</td>
    </tr>
  )
}

export default OrderItem;