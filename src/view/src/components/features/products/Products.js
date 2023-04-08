//imports
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { selectProducts, fetchProducts } from './productsSlice';
import { page } from '../../../utils/page';
import Product from './product/Product';
import './products.css';

//Component for rendering an aray of products and linking them to a product detail page.
function Products() {
  //Redux constants
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);

  //React state for pagination
  const [pageNum, setPageNum] = useState(1);
  const [numItems, setNumItems] = useState(9);

  //builds page object for controling and displaying paginated arrays
  const p = page(pageNum, setPageNum, numItems, setNumItems, products.length);

  //Handles page input from page controls 
  const handlePage = (e) => {
    p.setPage(e.target.value);
  }

  //Fetches product data from database
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  //Renders the Products element that displays agroup of products limited by the page object
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
          <button key={pNum} className='page-number' onClick={handlePage} value={pNum}>{pNum}</button>
        )
      })}
    </div>
  )
}

export default Products;