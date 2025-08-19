import { useState } from "react";
import { useNavigate } from "react-router-dom";

function QtyControl({ qty, onInc, onDec, onDelete }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 w-full ">
      {qty === 1 && onDelete ? (
        <button
          onClick={onDelete}
          className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl border grid place-items-center text-sm font-bold active:scale-95 transition-transform"
          aria-label="Delete"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
          </svg>
        </button>
      ) : (
        <button
          onClick={onDec}
          className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl border grid place-items-center text-lg sm:text-2xl font-Chewy active:scale-95 transition-transform"
          aria-label="Decrease"
        >
          −
        </button>
      )}
      <div className="min-w-6 sm:min-w-12 text-center text-base sm:text-xl font-Chewy">
        {qty}
      </div>
      <button
        onClick={onInc}
        className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl border grid place-items-center text-lg sm:text-2xl font-Chewy active:scale-95 transition-transform"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

function Empty({ msg }) {
  return (
    <div className="p-8 border rounded-2xl bg-white text-center text-gray-600">
      {msg}
    </div>
  );
}

function Modal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "confirm",
  cancelText = "cancel",
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4 font-Chewy tracking-wide">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg ">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex gap-2 justify-end">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-2xl border-2 border-black bg-white active:scale-95 transition-transform "
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-2xl bg-red-600 text-white active:scale-95 transition-transform border-2 border-black [text-shadow:_1px_1px_0_#000,_2px_1px_0_#000]"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper to check product type based on ID prefix
const isSingle = (code) => String(code || "").startsWith("S-STK");
const isDouble = (code) => String(code || "").startsWith("D-STK");

function Cart({ items, onAdd, onSub, onAddMore, onNext, setCart, onBack }) {
  const [showModal, setShowModal] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const navigate = useNavigate();

  const totalQty = items.reduce((s, x) => s + (x.qty || 0), 0);
  const totals = items.reduce(
    (acc, it) => {
      if (!it) return acc;
      if (it.category === "posters") acc.posters += it.qty || 0;
      else if (isSingle(it.id)) acc.single += it.qty || 0;
      else if (isDouble(it.id)) acc.double += it.qty || 0;
      else acc.single += it.qty || 0;
      return acc;
    },
    { posters: 0, single: 0, double: 0 }
  );

  const handleDelete = (itemId) => {
    setShowModal({
      title: "Delete Item",
      msg: "Are you sure you want to delete this item from your cart?",
      onConfirm: () => {
        // Remove item from cart completely
        const remainingItems = items.filter((item) => item.id !== itemId);
        const updatedCart = remainingItems.reduce((acc, item) => {
          acc[item.id] = item.qty;
          return acc;
        }, {});
        setCart(updatedCart);
        setShowModal(null);
      },
      onCancel: () => {
        // Set quantity back to 1 when cancel is clicked
        const updatedCart = {
          ...items.reduce((acc, item) => {
            acc[item.id] = item.qty;
            return acc;
          }, {}),
        };
        updatedCart[itemId] = 1; // Set the quantity to 1 for the specific item
        setCart(updatedCart);
        setShowModal(null);
      },
      confirmText: "Delete",
      cancelText: "Cancel",
    });
  };

  const handleBack = () => {
    if (items.length === 0) {
      navigate("/");
    } else {
      setShowLeaveModal(true);
    }
  };

  const confirmLeaveCart = () => {
    setCart({});
    if (typeof onBack === "function") onBack();
    navigate("/");
    setShowLeaveModal(false);
  };

  const cancelLeaveCart = () => {
    setShowLeaveModal(false);
  };

  return (
    <section>
      <div className="mb-3">
        <div className="cart-header-mobile flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-Chewy tracking-wide">Cart</h2>
            <p className="text-gray-600 text-sm font-Chewy">
              Review Your Order Details
            </p>
          </div>
        </div>
        <div className="cart-actions-mobile flex gap-2 sm:justify-end">
          <button
            onClick={handleBack}
            className="px-3 py-1.5 rounded-2xl bg-sky-400 text-white text-2xl font-Chewy shadow-2xl active:scale-95 transition-transform [text-shadow:_1px_1px_0_#000,_2px_1px_0_#000] border-2 border-black"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="px-3 py-1.5 rounded-2xl bg-sky-400 text-white text-2xl font-Chewy shadow-2xl active:scale-95 transition-transform border-2 border-black [text-shadow:_1px_1px_0_#000,_2px_1px_0_#000]"
          >
            Next 
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <Empty msg=" your cart is empty. go back to Home" />
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden mb-4 ">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 font-Chewy tracking-wider">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-center">Count</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t align-middle">
                  <td className="p-3">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={it.img}
                        alt="item"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </td>
                  <td className="p-3 font-mono">{it.id}</td>
                  <td className="p-3">
                    <QtyControl
                      qty={it.qty}
                      onInc={() => onAdd(it.id)}
                      onDec={() => onSub(it.id)}
                      onDelete={() => handleDelete(it.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal
          title={showModal.title}
          message={showModal.msg}
          onConfirm={showModal.onConfirm}
          onCancel={showModal.onCancel}
          confirmText={showModal.confirmText}
          cancelText={showModal.cancelText}
        />
      )}

      {showLeaveModal && (
        <Modal
          title="Leave Cart"
          message="Are you sure you want to leave the cart?"
          onConfirm={confirmLeaveCart}
          onCancel={cancelLeaveCart}
          confirmText="Yes"
          cancelText="No"
        />
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="">&nbsp;</div>
        <div className="flex gap-2">
          <button onClick={onAddMore} className="px-3 py-1.5 rounded-xl border-2 border-black [text-shadow:_1px_1px_0_#000,_2px_1px_0_#000] bg-green-700  font-Chewy text-white tracking-wide active:scale-95 transition-transform">
            Add More Products
          </button>
        </div>
      </div>

      <div className="p-4 mb-3">
        <div className="text-lg text-center text-gray-700 mb-2 font-Chewy">
          Total quantity   <b className="text-sky-400 text-2xl">{totalQty}</b>
        </div>
        <div className="text-lg text-center text-gray-700 font-Chewy">
          {" "}
          Posters  <b className="text-sky-400 text-2xl">{totals.posters}</b>
        </div>
        <div className="text-lg text-center text-gray-700 font-Chewy">
          Single  <b className="text-sky-400 text-2xl">{totals.single}</b>
        </div>
        <div className="text-lg text-center text-gray-700 font-Chewy">
          {" "}
          Double  <b className="text-sky-400 text-2xl">{totals.double}</b>
        </div>
      </div>


    </section>
  );
}

export default Cart;
