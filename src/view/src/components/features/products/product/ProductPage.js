import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { fetchProduct, selectProduct } from '../productsSlice';
import { useParams, useSearchParams } from 'react-router-dom';


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

  return (
    <div className='productPage'>
      <p>HI!</p>
      <h2 className='productName'>{product.name}</h2>
      <h3 className='price'>{product.price}</h3>
      <img src={`/images/products/product-img-${product.id}.png`} onError={addDefaultSrc} />
      <p>{product.description}</p>
      <h4>{product.vendorName}</h4>
      <p>{product.vendorDescription}</p>
    </div>
  )
}

export default Product;