import React from 'react';

function Modal({ open, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ">
      <div className="bg-white rounded-2xl shadow-2xl p-6 min-w-[300px] max-w-[90vw]">
        {children}
      </div>
    </div>
  );
}
function QtyControl({ qty, onInc, onDec, onDelete }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 w-full">
      {qty === 1 && onDelete ? (
        <button
          onClick={onDelete}
          className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg border grid place-items-center bg-red-500 text-white text-sm font-bold active:scale-95 transition-transform"
          aria-label="Delete"
        >
          Delete
        </button>
      ) : (
        <button
          onClick={onDec}
          className="w-9 h-9 sm:w-[40px] sm:h-[40px] rounded-2xl border border-sky-400 grid place-items-center text-lg sm:text-2xl font-bold active:scale-95 transition-transform font-Chewy text-sky-500 bg-white"
          aria-label="Decrease" 
        >
          −
        </button>
      )}
      <div className="min-w-6 sm:min-w-12 text-center text-base sm:text-xl font-semibold font-Chewy">{qty}</div>
      <button
        onClick={onInc}
        className="w-9 h-9 sm:w-[40px] sm:h-[40px] rounded-2xl border border-sky-400 grid place-items-center text-lg sm:text-2xl font-bold active:scale-95 transition-transform font-Chewy text-sky-500 bg-white"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

function ProductList({ category, items, cart, addToCart, onNext, onBack }) {
  const [showWarning, setShowWarning] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showChoice, setShowChoice] = React.useState(false);

  // Shuffle items every time ProductList is rendered

  // Automatically clear warning modal after 2 seconds
  React.useEffect(() => {
    if (showWarning) {
      const timer = setTimeout(() => setShowWarning(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showWarning]);
  const shuffled = React.useMemo(() => {
    const arr = items.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [items]);

  // Helper to check if cart has at least one item
  const hasItems = Object.values(cart).some(qty => qty > 0);

  const handleNext = () => {
    if (!hasItems) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    setShowChoice(true);
  };

  // Wrap addToCart to clear warning when adding an item
  const handleAddToCart = (id, qty) => {
    addToCart(id, qty);
    if (qty > 0) setShowWarning(false);
  };

  // Clear all items in cart
  const handleClearCart = () => {
    Object.keys(cart).forEach(id => {
      if (cart[id] > 0) addToCart(id, -cart[id]);
    });
  };

  const handleBack = () => {
    if (hasItems) {
      setShowConfirm(true);
    } else {
      onBack();
    }
  };

  // Handle choice modal selection
  const handleChoice = (option) => {
    setShowChoice(false);
    if (option === "cart") {
      onNext();
    } else if (option === "switch") {
      // Switch between stickers and posters
      if (category === "stickers") {
        onNext("posters");
      } else {
        onNext("stickers");
      }
    }
  };
  const handleConfirmLeave = (leave) => {
    setShowConfirm(false);
    if (leave) {
      handleClearCart();
      onBack();
    }
  };

  return (
    <section>
      {/* Choice Modal */}
      <Modal open={showChoice}>
        <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4 font-Chewy tracking-wide">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <div className="text-center mb-4 font-bold text-2xl">Choose where to go next</div>
            <div className="flex flex-col gap-2 items-center">
              <button
                className="px-2 py-1 rounded-2xl border-2 border-black bg-sky-400 text-white font-Chewy text-xl active:scale-95 transition-transform [text-shadow:_1px_1px_0_#000,_2px_1px_0_#000]"
                onClick={() => handleChoice("switch")}
              >
                {category === "stickers" ? "Go to Posters" : "Go to Stickers"}
              </button>
              <button
                className="px-5 py-1 rounded-2xl border-2 border-black bg-green-500 text-white font-Chewy text-xl active:scale-95 transition-transform [text-shadow:_1px_1px_0_#000,_2px_1px_0_#000]"
                onClick={() => handleChoice("cart")}
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="flex items-center justify-between mb-4 w-full">
        <div className="flex-1 flex justify-start">
          <button onClick={handleBack} className="px-3 py-1.5 rounded-2xl border-2 border-black bg-sky-400 text-white text-2xl font-Chewy shadow-2xl active:scale-95 transition-transform [text-shadow:_1px_1px_0_#000,_2px_1px_0_#000]"
          >
            Back</button>
        </div>
        <div className="flex-1 flex justify-center">
          <h2 className="tracking-wider text-[22px] md:text-[62px] font-bold whitespace-nowrap font-Chewy text-sky-400 active:scale-95 transition-transform md:[text-shadow:_1px_5px_0_#000,_2px_1px_0_#000] [text-shadow:_1px_3px_0_#000,_2px_1px_0_#000]">{category === "stickers" ? "Stickers" : "Posters"}</h2>
        </div>
        <div className="flex-1 flex justify-end">
          <button onClick={handleNext}className="px-3 py-1.5 rounded-2xl border-2 border-black bg-sky-400 text-white text-2xl font-Chewy shadow-2xl active:scale-95 transition-transform [text-shadow:_1px_1px_0_#000,_2px_1px_0_#000]"
          >
          Next</button>
        </div>
      </div>

      {/* Warning Modal */}
      <Modal open={showWarning}>
        <div className="text-red-600 text-center mb-4 font-Chewy tracking-wide text-2xl ">
          Add at least one item !
        </div>
      </Modal>

      {/* Confirm Modal */}
      <Modal open={showConfirm}>
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4 font-Chewy tracking-wide">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-bold mb-2">Are you sure you want to leave?</h3>
        <p className="text-sm text-gray-600 mb-4">You have {Object.values(cart).reduce((total, qty) => total + qty, 0)} items in your cart.</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handleConfirmLeave(false)}
            className="px-4 py-2 rounded-2xl bg-white active:scale-95 transition-transform border-2 border-black"
          >
            No
          </button>
          <button
            onClick={() => handleConfirmLeave(true)}
            className="px-4 py-2 rounded-2xl bg-red-600 text-white active:scale-95 transition-transform border-2 border-black"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
      </Modal>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {shuffled.map(p => (
          <div key={p.id} className="rounded-2xl overflow-hidden shadow-xl bg-white flex flex-col">
            <div className={"aspect-[215/297] relative"}>
              <img src={p.img} alt="product" className="absolute inset-0 w-full h-full object-contain" />
            </div>
            <div className="p-3 flex-1 flex flex-col gap-3">
              <QtyControl 
                qty={cart[p.id] || 0} 
                onInc={() => handleAddToCart(p.id, +1)} 
                onDec={() => handleAddToCart(p.id, -1)} 
              />
              <div className="flex justify-center">
              <button 
                onClick={() => handleAddToCart(p.id, +1)} 
                className="w-40 px-3 py-2 rounded-2xl bg-sky-500 text-white text-md md:text-[22px] shadow-lg active:scale-95 transition-transform whitespace-nowrap overflow-hidden text-ellipsis font-Chewy item "
                >
                Add To Cart
              </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductList;
