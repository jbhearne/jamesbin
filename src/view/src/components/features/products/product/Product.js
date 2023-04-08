//Component for rendering a single product card/div in within a group of products
function Product(props) {
  //props: produc contains the data to be rendered
  const { product } = props;

  //Create a default src attribute if there is an error so that a place holder image can be used
  const addDefaultSrc = (e) => {
    e.target.src = '/placeholder.png'
  }

  //Renders the product info within a <li> tag in Products element 
  return (
    <div className='product'>
      <h4 className='productName'>{product.name}</h4>
      <p className='price'>{product.price}</p>
      <img src={`/images/products/product-img-${product.id}.png` /*update to use S3 storage*/} onError={addDefaultSrc} />
    </div>
  )
}

export default Product;