import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { fetchProduct, selectProduct } from '../productsSlice';
import { useParams, useSearchParams } from 'react-router-dom';
import { addItemToCart } from '../../cart/cartSlice';


function Product() {
  //const { product } = props;
  const dispatch = useDispatch();
  const product = useSelector(selectProduct);
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [id]);

  const addDefaultSrc = (e) => {
    e.target.src = '/placeholder.png'
  }

  const addToCart = (e) => {
    dispatch(addItemToCart({
      id: -1,
      productName: product.name,
      productId: product.id,
      orderId: -1,
      price: product.price,
      quantity: 1,
    }))
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
      <button onClick={addToCart}>Add To Cart</button>
    </div>
  )
}

export default Product;