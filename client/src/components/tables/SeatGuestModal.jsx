import { useTranslation } from "../../context/PreferencesContext.jsx";
import {
  getTableDisplayName,
  SWEETHEART_TABLE_NAME,
} from "../../i18n/helpers.js";

function SeatGuestModal({
  open,
  guest,
  tables,
  onClose,
  onSelectTable,
  onUnseat,
}) {
  const { t } = useTranslation();

  if (!open || !guest) return null;

  const seatedTable = tables.find((table) =>
    table.guests.some((tableGuest) => tableGuest.id === guest.id),
  );

  const sortedTables = [...tables].sort((a, b) => {
    if (a.name === SWEETHEART_TABLE_NAME) return 1;
    if (b.name === SWEETHEART_TABLE_NAME) return -1;
    return a.order - b.order;
  });

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="wos-card rounded-[2rem] w-full max-w-md p-6 sm:p-8 shadow-xl max-h-[85vh] flex flex-col animate-[fadeIn_0.15s_ease-out]">
        <div className="h-14 w-14 rounded-2xl wos-guest-avatar flex items-center justify-center mb-5 text-xl font-semibold shrink-0">
          {guest.name.charAt(0).toUpperCase()}
        </div>

        <h2 className="text-2xl font-semibold wos-text-heading">
          {t("tables.seatGuestTitle")}
        </h2>

        <p className="wos-text-muted mt-2 leading-relaxed">
          {t("tables.seatGuestSubtitle")}{" "}
          <span className="font-semibold wos-text-heading">{guest.name}</span>
        </p>

        <p className="text-xs font-medium wos-text-muted mt-5 mb-3 uppercase tracking-wide">
          {t("tables.seatGuestChoose")}
        </p>

        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {sortedTables.map((table) => {
            const isSweetheart = table.name === SWEETHEART_TABLE_NAME;
            const capacity = isSweetheart ? 2 : table.capacity || 10;
            const isCurrent = table.guests.some(
              (tableGuest) => tableGuest.id === guest.id,
            );
            const isFull = table.guests.length >= capacity && !isCurrent;

            return (
              <button
                key={table.id}
                type="button"
                disabled={isFull}
                onClick={() => onSelectTable(table)}
                className={`w-full text-left rounded-2xl border px-4 py-3 transition active:scale-[0.99] ${
                  isCurrent
                    ? "border-[#660033] bg-[#fff0f3] text-[#660033]"
                    : isFull
                      ? "border-[#eadde2] bg-[#fff8fa] opacity-50 cursor-not-allowed"
                      : "border-[#eadde2] bg-[#fff8fa] hover:bg-[#fff0f3] wos-text-heading"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {getTableDisplayName(t, table.name)}
                    </p>
                    <p className="text-xs wos-text-muted mt-0.5 truncate">
                      {table.label || t("tables.defaultTableLabel")}
                    </p>
                  </div>

                  <span className="text-xs font-semibold shrink-0">
                    {isCurrent
                      ? t("tables.currentTable")
                      : isFull
                        ? t("tables.tableFull")
                        : `${table.guests.length}/${capacity}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 mt-6 shrink-0">
          {seatedTable && (
            <button
              type="button"
              onClick={onUnseat}
              className="w-full border border-[#eadde2] rounded-2xl py-3 font-medium wos-text-heading hover:bg-[#fff8fa] active:scale-95 transition"
            >
              {t("tables.removeFromTable")}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full wos-secondary-btn py-3 active:scale-95 transition"
          >
            {t("common.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeatGuestModal;
