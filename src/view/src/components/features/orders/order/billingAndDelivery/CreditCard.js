import { useDispatch, useSelector } from 'react-redux'
import { selectCcPlaceholder, setCcPlaceholder } from '../../ordersSlice';
import { useEffect } from 'react';

function CreditCard() {
  const dispatch = useDispatch();
  const ccPlaceholder = useSelector(selectCcPlaceholder);

  const handleSubmit = (e) => {
    dispatch(setCcPlaceholder(e.target.value))
  }

  return (
    <div>
      <h3>Credit Card</h3>
      <form id='creditCard' name='creditCard'>
        <label>Credit Card Number (placeholder): <input id='ccNumber' type='text' defaultValue={ccPlaceholder} onChange={handleSubmit}></input></label>
      </form>
    </div>
  )
}

export default CreditCard;