

function Order({ order, handleOrderClick }) {

  const date = new Date(order.dateCompleted);

  return (
    <tr onClick={() => handleOrderClick(order.id)}>
      <td>{order.id}</td><td>{date.toDateString()}</td><td>{order.amount}</td>
    </tr>
  )
}

export default Order;