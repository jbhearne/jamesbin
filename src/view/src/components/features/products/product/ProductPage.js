
//imports
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { fetchProduct, selectProduct } from '../productsSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { addItemToCart, selectTempCartId, incrementTempCartId } from '../../cart/cartSlice';
import '../products.css'

//Component that renders a detailed product page with controls for adding it to the cart
function Product() {

  //Redux constants
  const dispatch = useDispatch();
  const product = useSelector(selectProduct);
  const tempCartId = useSelector(selectTempCartId);
  
  //React Router constants
  const { id } = useParams();
  const navigate = useNavigate();

  //Fetch detailed product info from database
  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [id]);

  //Create a default src attribute if there is an error so that a place holder image can be used
  const addDefaultSrc = (e) => {
    e.target.src = '/placeholder.png'
  }

  //On submission it adds an item to the cart state and increments a tempCartId state. the database is updated on the Cart component. 
  const addToCart = (e) => {
    dispatch(addItemToCart({
      id: tempCartId,
      productName: product.name,
      productId: product.id,
      orderId: -1,
      price: product.price,
      quantity: e.target.quantity.value,
    }))
    dispatch(incrementTempCartId());
    navigate('/products')
  }

  //Renders the product detail page with controls for adding to cart.
  return (
    <div className='product-page'>
      <h2 className='product-name'>{product.name}</h2>
      <h3 className='price'>{product.price}</h3>
      <img src={`/images/products/product-img-${product.id}.png`} onError={addDefaultSrc} />
      <p>{product.description}</p>
      <h4>{product.vendorName}</h4>
      <p>{product.vendorDescription}</p>
      <form id='addToCart' onSubmit={addToCart}>
      <label>Quantity: <input id='quantity' type='number' min='1' max='100' defaultValue='1'></input></label>
      <button id='addButton'>Add To Cart</button>
      </form>
    </div>
  )
}

export default Product;