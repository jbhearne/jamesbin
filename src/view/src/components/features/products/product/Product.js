import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';

function Product(props) {
  const { product } = props;

  const addDefaultSrc = (e) => {
    e.target.src = '/placeholder.png'
  }

  return (
    <div className='product'>
      <h4 className='productName'>{product.name}</h4>
      <p className='price'>{product.price}</p>
      <img src={`/images/products/product-img-${product.id}.png`} onError={addDefaultSrc} />
    </div>
  )
}

export default Product;