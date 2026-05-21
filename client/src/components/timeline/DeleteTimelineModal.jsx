function DeleteTimelineModal({ open, item, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="wos-card w-full max-w-md p-8">
        <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center mb-5 text-2xl">
          🛤️
        </div>

        <h2 className="text-2xl font-semibold text-[#38131f]">
          Delete timeline step?
        </h2>

        <p className="text-[#7f7079] mt-3">
          Remove{" "}
          <span className="font-semibold text-[#38131f]">{item?.title}</span>{" "}
          from our timeline?
        </p>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-[#eadde2] rounded-2xl py-3 font-medium hover:bg-[#fff8fa] transition"
          >
            Keep
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white rounded-2xl py-3 font-medium hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTimelineModal;
