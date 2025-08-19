import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer'; //not used
import Modal from './components/Modal';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import './cart-mobile.css';

function AppContent() {
  const { toast, modal, busy, totalQty } = useApp();

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className='absolute inset-0 bg-cover bg-center blur-lg'   style={{ backgroundImage: "url('https://i.postimg.cc/sx8NfQGx/cover.png')" }}/>
  <Header logoUrl="https://i.postimg.cc/XqKVbXXc/logo.png" totalQty={totalQty} />
      <main className="relative flex-1 max-w-6xl mx-auto p-4 pb-24 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:category" element={<ProductListPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      {toast && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}
      {modal && (
        <Modal
          title={modal.title}
          message={modal.msg}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
        />
      )}
      {/* <Footer /> */}
      {/* {busy && (
        <div className="fixed inset-0 bg-black/20 grid place-items-center">
          <div className="animate-spin h-10 w-10 border-4 border-gray-200 border-t-gray-700 rounded-full"></div>
        </div>
      )} */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;