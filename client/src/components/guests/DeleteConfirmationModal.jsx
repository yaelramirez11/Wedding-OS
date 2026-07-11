import { useTranslation } from "../../context/PreferencesContext.jsx";

function DeleteConfirmationModal({ open, guest, onClose, onConfirm }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="wos-card rounded-[2rem] w-full max-w-md p-6 sm:p-8 shadow-xl animate-[fadeIn_0.15s_ease-out]">
        <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center mb-5 text-2xl">
          ❤️
        </div>

        <h2 className="text-2xl font-semibold wos-text-heading">
          {t("guests.deleteModalTitle")}
        </h2>

        <p className="wos-text-muted mt-3 leading-relaxed">
          {t("guests.deleteModalMessage")}{" "}
          <span className="font-semibold wos-text-heading">{guest?.name}</span>{" "}
          🥹
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-2xl py-3 font-medium hover:bg-gray-50 active:scale-95 transition"
          >
            {t("guests.deleteModalKeep")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white rounded-2xl py-3 font-medium hover:bg-red-600 active:scale-95 transition"
          >
            {t("guests.deleteModalRemove")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
