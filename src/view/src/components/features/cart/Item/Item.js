

function Item({ item }) {


  return (
    <div>
      <span>{item.name}</span><span>...</span><span>{item.price}</span>  <span>{item.quantity}</span>
    </div>
  )
}

export default Item;