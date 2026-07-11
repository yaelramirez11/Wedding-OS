import { useTranslation } from "../../context/PreferencesContext.jsx";
import { getTableDisplayName } from "../../i18n/helpers.js";

function DeleteTableModal({ open, table, onClose, onConfirm }) {
  const { t } = useTranslation();

  if (!open || !table) return null;

  const tableName = getTableDisplayName(t, table.name);
  const guestCount = table.guests?.length ?? 0;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="wos-card rounded-[2rem] w-full max-w-md p-6 sm:p-8 shadow-xl">
        <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center mb-5 text-[#660033]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7H8z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold wos-text-heading">
          {t("tables.deleteTableTitle")}
        </h2>

        <p className="wos-text-muted mt-3 leading-relaxed">
          {t("tables.deleteTableMessage")}{" "}
          <span className="font-semibold wos-text-heading">{tableName}</span>{" "}
          {t("tables.deleteTableMessageSuffix")}
        </p>

        {guestCount > 0 && (
          <p className="text-sm text-[#8d7380] mt-3">
            {guestCount} {t("common.guests")}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 wos-secondary-btn py-3 active:scale-95 transition"
          >
            {t("tables.deleteTableKeep")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white rounded-2xl py-3 font-medium hover:bg-red-600 active:scale-95 transition"
          >
            {t("common.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTableModal;
