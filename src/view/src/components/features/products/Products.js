import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { selectProducts, fetchProducts } from './productsSlice';
import { page } from '../../../utils/page';

import Product from './product/Product';
import './products.css';

function Products() {

  const dispatch = useDispatch();
  const products = useSelector(selectProducts);

  const [pageNum, setPageNum] = useState(1);
  const [numItems, setNumItems] = useState(9);
  const p = page(pageNum, setPageNum, numItems, setNumItems, products.length);
  const handlePage = (e) => {
    p.setPage(e.target.value)
  }

 useEffect(() => {
  dispatch(fetchProducts());
 }, []);

  return (
    <div className='main-products'>
      <h3>Many Fine Products...</h3>
      <ul className='productsCatalog'>
        {products.filter((item, idx) => idx >= p.pageStart && idx < p.pageEnd).map(product => {
          return (
            <li key={product.id}><Link to={`/product/${product.id}`}><Product product={product} /></Link></li>
          )
        })}
      </ul>
      <span className='page-nav'><button onClick={handlePage} value='prev'>prev</button><span>{pageNum}</span><button onClick={handlePage} value='next'>next</button></span>
      <br />
      {p.pageLinks.map(pNum =>  {
        return (
          <button className='page-number' onClick={handlePage} value={pNum}>{pNum}</button>
        )
      })}
    </div>
  )
}

export default Products;