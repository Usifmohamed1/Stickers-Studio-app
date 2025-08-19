import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Cart from '../components/Cart';

function CartPage() {
  const navigate = useNavigate();
  const { 
    selected, 
    addToCart, 
    clearCart, 
    setCart 
  } = useApp();

  const onAdd = (id) => addToCart(id, +1);
  const onSub = (id) => addToCart(id, -1);

  const onAddMore = () => {
    navigate('/');
  };

  const onNext = () => {
    navigate('/checkout');
  };

  return (
    <Cart
      items={selected}
      onAdd={onAdd}
      onSub={onSub}
      onClear={clearCart}
      onAddMore={onAddMore}
      onNext={onNext}
      setCart={setCart}
    />
  );
}

export default CartPage;
