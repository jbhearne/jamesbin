//Component for rendering line items in Orders element
function Order({ className, order, handleOrderClick }) {
  //props: className for styling the selected/unselected item, order has the data to render, handleOrderClick a function in Orders component "selects" and order.

  //Creates a JS date object from stored date.
  const date = new Date(order.dateCompleted);

  //Renders a row in the table in the Orders element. 
  return (
    <tr className={className} onClick={() => handleOrderClick(order.id)}>
      <td>{order.id}</td><td>{date.toDateString()}</td><td>{order.amount}</td>
    </tr>
  )
}

export default Order;