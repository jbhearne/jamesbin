import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { fetchProduct, selectProduct } from '../productsSlice';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { addItemToCart, selectTempCartId, incrementTempCartId } from '../../cart/cartSlice';


function Product() {
  //const { product } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector(selectProduct);
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [id]);

  const addDefaultSrc = (e) => {
    e.target.src = '/placeholder.png'
  }

  const tempCartId = useSelector(selectTempCartId);
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


  return (
    <div className='productPage'>
      <p>HI!</p>
      <h2 className='productName'>{product.name}</h2>
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