import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CheckoutForm from '../components/CheckoutForm';

function CheckoutPage() {
  const navigate = useNavigate();
  const { 
    customer, 
    setCustomer, 
    totalQty, 
    totalsByType, 
    submitOrder, 
    busy 
  } = useApp();

  const onBack = () => {
    navigate('/cart');
  };

  const onSubmit = async () => {
    await submitOrder();
    navigate('/');
  };

  return (
    <CheckoutForm
      customer={customer}
      setCustomer={setCustomer}
      totalQty={totalQty}
      totalsByType={totalsByType}
      onBack={onBack}
      onSubmit={onSubmit}
      loading={busy}
    />
  );
}

export default CheckoutPage;
