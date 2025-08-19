function CheckoutForm({ customer, setCustomer, totalQty, totalsByType, onBack, onSubmit, loading }) {
  const gov = customer.governorate;
  const payWith = customer.payWith;
  const payNumber = customer.payNumber;

  // QR code URLs (replace with your actual QR code images/links)
  const qrCodes = {
    "vodafoneCash": "https://i.postimg.cc/mrKWkzCK/2.png",
    "instapay": "https://i.postimg.cc/YSvwtfG1/1.png"
  };

  return (
    <section>
      <h2 className="text-2xl font-Chewy text-black tracking-wide text-center">Checkout</h2>
          <p className="text-gray-600 text-sm text-center font-Chewy mb-8">Review your details and Confirm</p>
<div className="relative flex items-center justify-center mb-10 mt-9">
  <div className="absolute left-0">
    <button
      onClick={onBack}
      className="px-3 py-1.5 rounded-2xl bg-sky-400 text-white text-2xl font-Chewy shadow-2xl active:scale-95 transition-transform"
    >
      ←
    </button>
  </div>
</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-Chewy tracking-wide">
        <label className="block">
          <div className="mb-1 text-sm">Name</div>
          <input value={customer.name} onChange={e=>setCustomer({ ...customer, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border" placeholder="Customer Name" />
        </label>
        <label className="block">
          <div className="mb-1 text-sm">Phone Number</div>
          <input value={customer.phone} onChange={e=>setCustomer({ ...customer, phone: e.target.value })} className="w-full px-3 py-2 rounded-xl border" placeholder="010xxxxxxxx" />
        </label>
        <label className="block">
          <div className="mb-1 text-sm">Governorate</div>
          <select value={gov} onChange={e=>setCustomer({ ...customer, governorate: e.target.value })} className="w-full px-3 py-2 rounded-xl border">
            <option value="Alexandria">Alexandria</option>
            <option value="Cairo">Cairo</option>
            <option value="other">Other</option>
          </select>
        </label>
        {gov === "other" && (
          <label className="block">
            <div className="mb-1 text-sm">Governorate</div>
            <input value={customer.otherGov} onChange={e=>setCustomer({ ...customer, otherGov: e.target.value })} className="w-full px-3 py-2 rounded-xl border" placeholder="write your governorate" />
          </label>
        )}
        <label className="block">
          <div className="mb-1 text-sm">Pay With</div>
          <select
            value={payWith}
            onChange={e => setCustomer({ ...customer, payWith: e.target.value, payNumber: "" })}
            className="w-full px-3 py-2 rounded-xl border"
          >
            <option value="">--</option>
            <option value="cash">Cash</option>
            <option value="vodafoneCash">Vodafone Cash</option>
            <option value="instapay">Instapay</option>
          </select>
        </label>

        {(payWith === "cash" || payWith === "vodafoneCash" || payWith === "instapay") && (
          <label className="block">
            <div className="mb-1 text-sm">
              {payWith === "cash" ? "Payment Price" : "Payment Number"}
            </div>
            <input
              value={payNumber}
              onChange={e => setCustomer({ ...customer, payNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border"
              placeholder="Enter Payment Price "
            />
          </label>
        )}

        {(payWith === "vodafoneCash" || payWith === "instapay") && (
          <div className="flex flex-col items-center justify-center">
            <div className="mb-1 text-sm">Scan QR to pay</div>
            <img
              src={qrCodes[payWith]}
              alt={`${payWith} QR`}
              className="w-36 h-36 object-contain border rounded-xl"
            />
          </div>
        )}
        <label className="md:col-span-2 block">
          <div className="mb-1 text-sm">Notes</div>
          <textarea value={customer.notes} onChange={e=>setCustomer({ ...customer, notes: e.target.value })} className="w-full px-3 py-2 rounded-xl border" rows={4} placeholder="write your Note" />
        </label>
      </div>

      <div className="text-lg text-center text-gray-700 mt-10 mb-2 font-Chewy">Total quantity <b className="text-sky-400 text-2xl">{totalQty}</b></div>  
      <div className="text-lg text-center text-gray-700 font-Chewy"> Posters <b className="text-sky-400 text-2xl">{totalsByType.posters}</b></div>
      <div className="text-lg text-center text-gray-700 font-Chewy"> Single <b className="text-sky-400 text-2xl">{totalsByType.single}</b></div>
      <div className="text-lg text-center text-gray-700 font-Chewy"> Double <b className="text-sky-400 text-2xl">{totalsByType.double}</b></div>
        
<div className="mt-6 flex justify-end">
    <button 
      disabled={loading} 
      onClick={onSubmit} 
      className="px-4 py-2 rounded-xl bg-sky-400 text-white font-Chewy text-lg tracking-wide"
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        'Confirm'
      )}
    </button>
</div>

    </section>
  );
}

export default CheckoutForm;
