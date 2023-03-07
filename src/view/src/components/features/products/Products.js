import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { selectProducts, fetchProducts } from './productsSlice';

import Product from './product/Product';
import './products.css';

function Products() {

  const dispatch = useDispatch();
  const products = useSelector(selectProducts);

 useEffect(() => {
  dispatch(fetchProducts());
 }, []);

  return (
    <div>
      <h3>Many Fine Products...</h3>
      <ul className='productsCatalog'>
        {products.map(product => {
          return (
            <li key={product.id}><Link to={`/product/${product.id}`}><Product product={product} /></Link></li>
          )
        })}
      </ul>
    </div>
  )
}

export default Products;