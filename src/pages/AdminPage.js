import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AdminPageComponent from '../components/AdminPage';

function AdminPage() {
  const navigate = useNavigate();
  const { 
    catalog, 
    setCatalog, 
    setModal, 
    reloadCatalog 
  } = useApp();

  const onBack = () => {
    navigate('/');
  };

  return (
    <AdminPageComponent
      catalog={catalog}
      setCatalog={setCatalog}
      onBack={onBack}
      showModal={setModal}
      reloadCatalog={reloadCatalog}
    />
  );
}

export default AdminPage;
