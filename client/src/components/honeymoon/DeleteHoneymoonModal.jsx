function DeleteHoneymoonModal({ open, item, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="wos-card rounded-[2rem] w-full max-w-md p-6 sm:p-8 shadow-xl">
        <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center mb-5 text-2xl">
          🐷
        </div>

        <h2 className="text-2xl font-semibold text-gray-950">
          Delete expense?
        </h2>

        <p className="text-gray-500 mt-3 leading-relaxed">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-black">{item?.title}</span> from
          our expenses, my Sweetheart?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-2xl py-3 font-medium hover:bg-gray-50 active:scale-95 transition"
          >
            Keep expense
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white rounded-2xl py-3 font-medium hover:bg-red-600 active:scale-95 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteHoneymoonModal;
