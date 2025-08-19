import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductList from '../components/ProductList';

function ProductListPage() {
  const navigate = useNavigate();
  const { category } = useParams();
  const { 
    cart, 
    addToCart, 
    itemsByCategory, 
    setCategory 
  } = useApp();

  // Set the category when the component mounts
  useEffect(() => {
    setCategory(category);
    return () => setCategory(null); // Reset category when leaving page
  }, [category, setCategory]);

  const onNext = (destination) => {
    if (destination === "stickers") {
      setCategory("stickers");
      navigate("/products/stickers");
    } else if (destination === "posters") {
      setCategory("posters");
      navigate("/products/posters");
    } else {
      navigate("/cart");
    }
  };

  const onBack = () => {
    navigate('/');
  };

  return (
    <ProductList
      category={category}
      items={itemsByCategory}
      cart={cart}
      addToCart={addToCart}
      onNext={onNext}
      onBack={onBack}
    />
  );
}

export default ProductListPage;
