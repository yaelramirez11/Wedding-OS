import { useTranslation } from "../../context/PreferencesContext.jsx";

function DeleteTimelineModal({ open, item, onClose, onConfirm }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="wos-card w-full max-w-md p-8">
        <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center mb-5 text-2xl">
          🛤️
        </div>

        <h2 className="text-2xl font-semibold wos-text-heading">
          {t("timeline.deleteTitle")}
        </h2>

        <p className="wos-text-muted mt-3">
          {t("timeline.deleteMessage")}{" "}
          <span className="font-semibold wos-text-heading">{item?.title}</span>{" "}
          {t("timeline.deleteMessageSuffix")}
        </p>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 wos-secondary-btn py-3 transition"
          >
            {t("timeline.deleteKeep")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white rounded-2xl py-3 font-medium hover:bg-red-600 transition"
          >
            {t("common.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTimelineModal;
