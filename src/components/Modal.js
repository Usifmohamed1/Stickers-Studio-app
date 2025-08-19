function Modal({ title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex gap-2 justify-end">
          {onCancel && (
            <button onClick={onCancel} className="px-4 py-2 rounded-xl border bg-white active:scale-95 transition-transform">
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-gray-900 text-white active:scale-95 transition-transform">
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
