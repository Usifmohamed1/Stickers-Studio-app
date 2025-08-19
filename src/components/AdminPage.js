import { useState, useEffect } from "react";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwkH6IkUo8SYNSe6dzx9zYXK7jBnm32SxXvPScA6uriMS2MVo27lHFqrfEDCQZVYLuO9g/exec";

function Modal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  busy = false,
  showConfirm = true, // add showConfirm prop
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4 ">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg ">
        <h3 className="text-lg font-bold mb-2 ">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 ">{message}</p>
        <div className="flex gap-2 justify-end ">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-2xl border border-black bg-white text-black  active:scale-95 transition-transform"
              disabled={busy}
            >
              {cancelText}
            </button>
          )}
          {showConfirm && onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-2xl bg-red-600 text-white flex items-center justify-center  active:scale-95 transition-transform"
              disabled={busy}
            >
              {busy ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-gray-200 border-t-gray-700 rounded-full"></span>
                  Loading...
                </span>
              ) : (
                confirmText
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const ADMIN_USER = "admin";
const ADMIN_PASS = "0000";

function AdminPage({ catalog, setCatalog, onBack, reloadCatalog }) {
  // Busy state for loading spinner
  const [busy, setBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false); // add deleteBusy state
  // Use separate state for form fields to handle conditional rendering
  const [formCategory, setFormCategory] = useState("stickers");
  const [formType, setFormType] = useState("single");
  const [formId, setFormId] = useState("");
  const [formImg, setFormImg] = useState("");
  const [modal, setModal] = useState(null);

  // Authentication state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Filter state only
  const [filterType, setFilterType] = useState("all");

  // Get unique product types for filter dropdown
  const productTypes = Array.from(new Set(catalog.map((p) => p.type)));

  // Filter catalog by type
  const filteredCatalog =
    filterType === "all"
      ? catalog
      : catalog.filter((p) => p.type === filterType);

  // Sort filtered catalog by type
  const sortedCatalog = [...filteredCatalog].sort((a, b) => {
    if (a.type < b.type) return -1;
    if (a.type > b.type) return 1;
    return 0;
  });

  // Effect to auto-generate the product ID when category or type changes
  useEffect(() => {
    if (!catalog) return;

    const generateNewId = () => {
      let prefix = "";
      let newId = "";

      if (formCategory === "stickers") {
        if (formType === "single") {
          prefix = "S-STK-000";
          // Find the highest number after S-stk-000
          const lastNumber =
            catalog
              .filter((p) => p.id.startsWith(prefix))
              .map((p) => parseInt(p.id.replace(prefix, ""), 10))
              .filter((n) => !isNaN(n))
              .sort((a, b) => a - b)
              .pop() || 0;
          const newNumber = lastNumber + 1;
          newId = `${prefix}${newNumber}`;
        } else if (formType === "double") {
          prefix = "D-STK-00";
          // Find the highest number after D-stk-00
          const lastNumber =
            catalog
              .filter((p) => p.id.startsWith(prefix))
              .map((p) => parseInt(p.id.replace(prefix, ""), 10))
              .filter((n) => !isNaN(n))
              .sort((a, b) => a - b)
              .pop() || 0;
          const newNumber = lastNumber + 1;
          newId = `${prefix}${newNumber}`;
        }
      } else {
        // posters
        prefix = "PST-";
        const formatLength = 3;
        const lastNumber =
          catalog
            .filter((p) => p.id.startsWith(prefix))
            .map((p) => parseInt(p.id.split("-").pop(), 10))
            .filter((n) => !isNaN(n))
            .sort((a, b) => a - b)
            .pop() || 0;
        const newNumber = lastNumber + 1;
        newId = `${prefix}${String(newNumber).padStart(formatLength, "0")}`;
      }
      setFormId(newId);
    };

    generateNewId();
  }, [formCategory, formType, catalog]);

  const addProduct = async () => {
    if (!formId.trim() || !formImg.trim()) {
      setModal({
        title: "Warning !",
        message: "Please fill Category, Type, and Image Link .",
        showConfirm: false, // hide confirm button
      });
      setTimeout(() => setModal(null), 1500); // auto-close after 2 seconds
      return;
    }

    if (catalog.some((p) => p.id === formId.trim())) {
      return setModal({
        title: "error",
        message:
          "this product ID already exists in the catalog. please choose a different ID.",
        onConfirm: () => setModal(null),
      });
    }

    const newItem = {
      id: formId.trim(),
      category: formCategory,
      img: formImg.trim(),
      type:
        formCategory === "stickers"
          ? formType
          : formCategory === "posters"
          ? "poster"
          : "",
    };

    setBusy(true);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
        mode: "no-cors",
      });
      setFormImg("");
      setModal({
        title: "Success",
        message: "Product added to Google Sheets!",
        showConfirm: false,
      });
      setTimeout(async () => {
        setModal(null);
        if (typeof reloadCatalog === "function") await reloadCatalog();
      }, 1500);
    } catch (e) {
      setModal({
        title: "Error",
        message: "Failed to add product to Google Sheets.",
        onConfirm: () => setModal(null),
      });
    } finally {
      setBusy(false);
    }
  };

  const removeProduct = (id) => {
    setModal({
      title: "Confirm Delete",
      message: `Are you sure you want to delete ${id}?`,
      onConfirm: async () => {
        setDeleteBusy(true); // show loading spinner
        try {
          await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete", code: id }),
            mode: "no-cors",
          });
        } catch (e) {
          // ignore error, will reload catalog anyway
        }
        setDeleteBusy(false);
        setModal(null);
        if (typeof reloadCatalog === "function") await reloadCatalog();
      },
      onCancel: () => setModal(null),
    });
  };

  // Authentication check
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-sm mx-auto mt-16 p-6 border border-gray-300 rounded-2xl shadow-md bg-white font-Chewy text-center">
        <h2 className="text-2xl font-bold mb-4 text-black">Admin Login</h2>
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center space-y-3"
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-60 px-3 py-2 border border-black rounded-2xl text-center"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-60 px-3 py-2 border border-black rounded-2xl text-center"
          />

          <div className="flex gap-3 mt-2">
            <button
              onClick={onBack}
              type="button"
              className="w-14 py-2 bg-sky-400 text-white rounded-2xl text-lg font-Chewy shadow-2xl hover:bg-sky-600 active:scale-95 transition-transform border-2 border-black [text-shadow:_1px_1px_0_#000,_2px_1px_0_#000]"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-24 py-2 bg-green-700 text-white rounded-2xl hover:bg-green-900 active:scale-95 transition-transform border-2 border-black [text-shadow:_1px_1px_0_#000,_2px_1px_0_#000]"
            >
              Login
            </button>
          </div>
        </form>

        {loginError && (
          <div className="text-red-600 mt-4 font-medium">{loginError}</div>
        )}
      </div>
    );
  }

  // ...existing code...
  return (
    <section>
      {/* ...existing code... (admin controls) */}
      {/* The rest of the admin page UI remains unchanged */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-2xl bg-sky-400 text-white text-2xl font-Chewy shadow-2xl  active:scale-95 transition-transform border-2 border-black [text-shadow:_1px_1px_0_#000,_2px_1px_0_#000]"
          >
            Back
          </button>
        </div>
        <h2 className="text-2xl">
          <a
            target="_blank"
            href="https://docs.google.com/spreadsheets/d/1B2LoscDH5pEGesdS8p0E4dMpsHIXc06l-I_6VMQr-Lo/edit?gid=0#gid=0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="35"
              height="35"
              viewBox="0 0 48 48"
            >
              <linearGradient
                id="PTsiEfj2THKtO9xz06mlla_qrAVeBIrsjod_gr1"
                x1="24"
                x2="24"
                y1="5"
                y2="43"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#21ad64"></stop>
                <stop offset="1" stopColor="#088242"></stop>
              </linearGradient>
              <path
                fill="url(#PTsiEfj2THKtO9xz06mlla_qrAVeBIrsjod_gr1)"
                d="M39,16v25c0,1.105-0.895,2-2,2H11c-1.105,0-2-0.895-2-2V7c0-1.105,0.895-2,2-2h17L39,16z"
              ></path>
              <path
                fill="#61e3a7"
                d="M28,5v9c0,1.105,0.895,2,2,2h9L28,5z"
              ></path>
              <path
                fill="#107c42"
                d="M39,16h-9c-0.473,0-0.917-0.168-1.257-0.444L39,27V16z"
              ></path>
              <path
                fill="#fff"
                d="M32,23H16c-0.553,0-1,0.448-1,1v12c0,0.552,0.447,1,1,1h16c0.553,0,1-0.448,1-1V24	C33,23.448,32.553,23,32,23z M17,29h4v2h-4V29z M23,29h8v2h-8V29z M31,27h-8v-2h8V27z M21,25v2h-4v-2H21z M17,33h4v2h-4V33z M23,35	v-2h8v2H23z"
              ></path>
              <path
                d="M32,22.5c0.827,0,1.5,0.673,1.5,1.5v12c0,0.827-0.673,1.5-1.5,1.5H16c-0.827,0-1.5-0.673-1.5-1.5V24 c0-0.827,0.673-1.5,1.5-1.5H32 M32,22H16c-1.103,0-2,0.897-2,2v12c0,1.103,0.897,2,2,2h16c1.103,0,2-0.897,2-2V24 C34,22.897,33.103,22,32,22L32,22z"
                opacity=".05"
              ></path>
              <path
                d="M32,23c0.553,0,1,0.448,1,1v12c0,0.552-0.447,1-1,1H16c-0.553,0-1-0.448-1-1V24c0-0.552,0.447-1,1-1	H32 M32,22.5H16c-0.827,0-1.5,0.673-1.5,1.5v12c0,0.827,0.673,1.5,1.5,1.5h16c0.827,0,1.5-0.673,1.5-1.5V24	C33.5,23.173,32.827,22.5,32,22.5L32,22.5z"
                opacity=".07"
              ></path>
            </svg>
          </a>
        </h2>
      </div>
      <div className="bg-white rounded-2xl border p-3 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Category Dropdown */}
        <div className="w-full md:col-span-1">
          <select
            className="w-full px-3 py-2 rounded-xl border mb-2 md:mb-0"
            value={formCategory}
            onChange={(e) => setFormCategory(e.target.value)}
          >
            <option value="stickers">Stickers</option>
            <option value="posters">Posters</option>
          </select>
        </div>

        {/* Conditional Type Dropdown for Stickers */}
        {formCategory === "stickers" && (
          <div className="w-full md:col-span-1">
            <select
              className="w-full px-3 py-2 rounded-xl border mb-2 md:mb-0"
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
            </select>
          </div>
        )}
        {/* Image Link Input */}
        <div className="w-full md:col-span-2">
          <input
            className="w-full px-3 py-2 rounded-xl border mb-2 md:mb-0"
            value={formImg}
            onChange={(e) => setFormImg(e.target.value)}
            placeholder="image link (https://.../image.jpg)"
          />
        </div>
        {/* Product ID (Auto-generated) */}
        <div className="w-full md:col-span-4">
          <label className="block text-sm text-gray-600 mb-1">
            Product ID (Auto-generated)
          </label>
          <input
            className="w-full px-3 py-2 rounded-xl border bg-gray-100 cursor-not-allowed"
            value={formId}
            readOnly
          />
        </div>

        <div className="w-full md:col-span-4 flex justify-center">
          <button
            onClick={addProduct}
            className="px-4 py-2 rounded-2xl font-Chewy bg-green-600 text-white  active:scale-95 transition-transform border-2 border-black [text-shadow:_1px_1px_0_#000,_2px_1px_0_#000]"
            disabled={busy}
          >
            {busy ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-5 w-5 border-2 border-gray-200 border-t-gray-700 rounded-full"></span>
                Loading...
              </span>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
      <div className="flex gap-2 items-center mb-4">
        <label className="font-semibold text-gray-700">Filter by Type:</label>
        <select
          className="px-3 py-2 rounded-xl border"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          {productTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {sortedCatalog.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl overflow-hidden border bg-white"
          >
            <div className={"aspect-[210/297] relative"}>
              <img
                src={p.img}
                alt={p.id}
                className="absolute inset-0 w-full h-full object-contain"
              />
              <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-white/90 border">
                {p.id}
              </div>
            </div>
            <div className="p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-xs text-gray-600 truncate text-center md:text-left ">
                {p.category} - {p.type}
              </div>
              <button
                onClick={() => removeProduct(p.id)}
                className="px-2 py-1 rounded-xl w-full md:w-auto bg-red-600 flex items-center justify-center  active:scale-95 transition-transform"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="22"
                  viewBox="0 0 1024 1024"
                >
                  <path
                    fill="#ffffff"
                    d="M360 184h-8c4.4 0 8-3.6 8-8zh304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32M731.3 840H292.7l-24.2-512h487z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal
          title={modal.title}
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
          busy={deleteBusy}
          showConfirm={modal.showConfirm !== false}
        />
      )}
    </section>
  );
}

export default AdminPage;
