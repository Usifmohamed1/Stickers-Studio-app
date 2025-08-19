import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Home from '../components/Home';

function HomePage() {
  const navigate = useNavigate();
  const { totalQty } = useApp();

  const gotoCategory = (category) => {
    navigate(`/products/${category}`);
  };

  const onGoCart = () => {
    navigate('/cart');
  };

  const openAdmin = () => {
    navigate('/admin');
  };

  return (
    <Home
      gotoCategory={gotoCategory}
      onGoCart={onGoCart}
      totalQty={totalQty}
      openAdmin={openAdmin}
    />
  );
}

export default HomePage;
