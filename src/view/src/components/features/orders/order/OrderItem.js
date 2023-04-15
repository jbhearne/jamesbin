//Component for rendering a line item of an individual order 
function OrderItem({ item }) {
  //props: item contains the data to be rendered 

  //Renders a row on a table in  the Orders Element
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