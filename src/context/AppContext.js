import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwkH6IkUo8SYNSe6dzx9zYXK7jBnm32SxXvPScA6uriMS2MVo27lHFqrfEDCQZVYLuO9g/exec";

// Helper to shuffle an array
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Helpers to check product type based on ID prefix
const isSingle = (code) => String(code || "").startsWith("S-STK");
const isDouble = (code) => String(code || "").startsWith("D-STK");

const AppContext = createContext();

export function AppProvider({ children }) {
  const [category, setCategory] = useState(null); // 'stickers' | 'posters'
  const [cart, setCart] = useState({}); // { productId: qty }
  const [customer, setCustomer] = useState({ name: "", phone: "", governorate: "Alexandria", otherGov: "", payWith: "cash", payNumber: "" , notes: ""});
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // {title, msg, onConfirm, onCancel, confirmText, cancelText}
  const [catalog, setCatalog] = useState([]);

  // Helper to reload catalog from Google Sheets
  const reloadCatalog = async () => {
    setBusy(true);
    try {
      const url = APPS_SCRIPT_URL + (APPS_SCRIPT_URL.includes('?') ? '&' : '?') + 't=' + Date.now();
      const res = await fetch(url);
      const text = await res.text();
      console.log("[Catalog Response]", text); // Debug: print raw response
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        setToast({ type: "error", msg: "Catalog fetch error: " + text.slice(0, 200) });
        setBusy(false);
        return;
      }
      // Map Google Sheet fields to expected fields and filter invalid rows
      if (Array.isArray(data)) {
        const mapped = data
          .map(row => ({
            id: row["Code"]?.trim() || "",
            category: row["Category"]?.trim() || "",
            img: row["Image Link"]?.trim() || "",
            type: row["Type"]?.trim() || ""
          }))
          .filter(row => row.id && row.img); // ignore empty/invalid rows
        if (mapped.length > 0) {
          setCatalog(mapped);
        }
      }
    } catch (e) {
      setToast({ type: "error", msg: "Failed to load catalog from Google Sheets" });
    } finally {
      setBusy(false);
    }
  };

  // Load catalog from Google Sheets on mount
  useEffect(() => {
    reloadCatalog();
  }, []);

  // Memoized and shuffled items for the product list view
  const itemsByCategory = useMemo(() => catalog.filter(p => category && p.category === category), [catalog, category]);
  const [shuffledItems, setShuffledItems] = useState(() => shuffle(itemsByCategory));
  useEffect(() => { setShuffledItems(shuffle(itemsByCategory)); }, [itemsByCategory]);

  // Memoized list of items in the cart
  const selected = useMemo(() => Object.entries(cart).map(([id, qty]) => ({ ...catalog.find(p => p.id === id), qty })), [cart, catalog]);
  const totalQty = selected.reduce((s, x) => s + (x?.qty || 0), 0);

  function addToCart(id, delta = 1) {
    setCart(prev => {
      const newQty = (prev[id] || 0) + delta;
      if (newQty > 0) {
        return { ...prev, [id]: newQty };
      } else {
        // Remove product from cart if qty is 0 or less
        const { [id]: _, ...rest } = prev;
        return rest;
      }
    });
  }

  function clearCart() { setCart({}); }

  // Prepare payload with posters/single/double counts for Apps Script
  const totalsByType = useMemo(() => {
    let posters = 0, single = 0, double = 0;
    for (const it of selected) {
      if (!it) continue;
      if (it.category === 'posters') posters += it.qty || 0;
      else if (isSingle(it.id)) single += it.qty || 0;
      else if (isDouble(it.id)) double += it.qty || 0;
      else single += it.qty || 0; // default to single
    }
    return { posters, single, double };
  }, [selected]);

  async function submitOrder() {
    // not required (name/phone/governorate)
    const gov = customer.governorate || "";
    // cart required
    if (!selected.length) {
      setToast({ type: "error", msg: "please select at least one product" });
      return;
    }

    const payload = {
      customer: {
        name: customer.name || "",
        phone: customer.phone || "",
        governorate: gov === "other" ? (customer.otherGov || "").trim() : gov,
        notes: customer.notes || "",
        payWith: customer.payWith || "",
        payNumber: customer.payNumber || ""
      },
      items: selected.map(({ id, category, qty }) => ({ code: id, category, qty })),
      totals: { posters: totalsByType.posters, single: totalsByType.single, double: totalsByType.double, count: totalQty },
      createdAt: new Date().toISOString(),
    };

    try {
      setBusy(true);
      // Debug: print payload so we can inspect what is being sent
      console.log("Order payload:", payload);

      // First try a normal CORS POST so the server receives JSON with correct headers.
      // If the Apps Script isn't configured for CORS this will throw — in that case
      // we fall back to a no-cors POST so the request still goes out (opaque).
      let res;
      try {
        res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.warn("CORS POST failed, retrying with no-cors fallback:", e);
        // fallback: fire a no-cors request (opaque) so browsers that can't reach
        // the Apps Script via CORS still send the data. Note: the server will
        // receive the body but the response is opaque and cannot be inspected.
        await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          mode: "no-cors",
        });
        res = { ok: true };
      }

      if (res && res.ok === false) {
        throw new Error('failed to send order (bad response)');
      }
      setModal({
        title: "Order Sent!",
        msg: "Your order was sent successfully.",
        onConfirm: null,
        confirmText: null,
        onCancel: null,
        cancelText: null
      });
        setTimeout(() => {
        setModal(null);
        clearCart();
  // keep payWith default to cash and reset governorate to Alexandria
  setCustomer({ name: "", phone: "", governorate: "Alexandria", otherGov: "", payWith: "cash", payNumber: "", notes: "" });
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", msg: "failed to send to Google Sheets, check your Apps Script" });
    } finally {
      setBusy(false);
    }
  }
  
  // Helper function to close toast messages after a delay
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const value = {
    category,
    setCategory,
    cart,
    setCart,
    customer,
    setCustomer,
    busy,
    setBusy,
    toast,
    setToast,
    modal,
    setModal,
    catalog,
    setCatalog,
    reloadCatalog,
    itemsByCategory,
    shuffledItems,
    selected,
    totalQty,
    totalsByType,
    addToCart,
    clearCart,
    submitOrder
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
