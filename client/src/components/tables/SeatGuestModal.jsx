import { useMemo, useState } from "react";

import BanquetTableSeating from "./BanquetTableSeating.jsx";
import { buildSeatSlots, getTableCapacity } from "./tableSeatingUtils.js";
import { useTranslation } from "../../context/PreferencesContext.jsx";
import {
  getGuestStatusConfig,
  getTableDisplayName,
  SWEETHEART_TABLE_NAME,
} from "../../i18n/helpers.js";

function SeatGuestModal({
  open,
  guest,
  tables,
  onClose,
  onSelectSeat,
  onUnseat,
}) {
  const { t } = useTranslation();
  const statusConfig = useMemo(() => getGuestStatusConfig(t), [t]);
  const [selectedTableId, setSelectedTableId] = useState(null);

  const seatedTable = useMemo(
    () =>
      tables.find((table) =>
        table.guests.some((tableGuest) => tableGuest.id === guest?.id),
      ),
    [guest, tables],
  );

  const sortedTables = useMemo(
    () =>
      [...tables].sort((a, b) => {
        if (a.name === SWEETHEART_TABLE_NAME) return 1;
        if (b.name === SWEETHEART_TABLE_NAME) return -1;
        return a.order - b.order;
      }),
    [tables],
  );

  const selectedTable = sortedTables.find(
    (table) => table.id === selectedTableId,
  );

  if (!open || !guest) return null;

  const handleClose = () => {
    setSelectedTableId(null);
    onClose();
  };

  const handlePickTable = (table) => {
    setSelectedTableId(table.id);
  };

  const handlePickSeat = (seatIndex) => {
    if (!selectedTable) return;
    onSelectSeat(selectedTable, seatIndex);
    setSelectedTableId(null);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="wos-card rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-xl max-h-[90vh] flex flex-col">
        <div className="h-14 w-14 rounded-2xl wos-guest-avatar flex items-center justify-center mb-5 text-xl font-semibold shrink-0">
          {guest.name.charAt(0).toUpperCase()}
        </div>

        <h2 className="text-2xl font-semibold wos-text-heading">
          {selectedTable
            ? t("tables.chooseSeatTitle")
            : t("tables.seatGuestTitle")}
        </h2>

        <p className="wos-text-muted mt-2 leading-relaxed">
          {selectedTable ? (
            <>
              {t("tables.chooseSeatSubtitle")}{" "}
              <span className="font-semibold wos-text-heading">
                {getTableDisplayName(t, selectedTable.name)}
              </span>
            </>
          ) : (
            <>
              {t("tables.seatGuestSubtitle")}{" "}
              <span className="font-semibold wos-text-heading">{guest.name}</span>
            </>
          )}
        </p>

        {!selectedTable ? (
          <>
            <p className="text-xs font-medium wos-text-muted mt-5 mb-3 uppercase tracking-wide">
              {t("tables.seatGuestChoose")}
            </p>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {sortedTables.map((table) => {
                const isSweetheart = table.name === SWEETHEART_TABLE_NAME;
                const capacity = getTableCapacity(table);
                const isCurrent = table.guests.some(
                  (tableGuest) => tableGuest.id === guest.id,
                );
                const isFull = table.guests.length >= capacity && !isCurrent;

                return (
                  <button
                    key={table.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => handlePickTable(table)}
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
          </>
        ) : (
          <div className="mt-5 overflow-y-auto flex-1 pr-1">
            <div className="rounded-[1.75rem] border border-[#eadde2] bg-[#fff8fa] p-4">
              <BanquetTableSeating
                table={selectedTable}
                guests={selectedTable.guests.filter(
                  (tableGuest) => tableGuest.id !== guest.id,
                )}
                capacity={getTableCapacity(selectedTable)}
                isSweetheart={
                  selectedTable.name === SWEETHEART_TABLE_NAME
                }
                variant="light"
                prefersTapLayout
                selectedGuestId={guest.id}
                statusConfig={statusConfig}
                emptyLabel={t("tables.tapSeat")}
                onDragStart={() => {}}
                onGuestClick={() => {}}
                onSeatDrop={() => {}}
                onEmptySeatClick={(_, seatIndex) => handlePickSeat(seatIndex)}
              />

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
                {buildSeatSlots(
                  selectedTable.guests.filter(
                    (tableGuest) => tableGuest.id !== guest.id,
                  ),
                  getTableCapacity(selectedTable),
                ).map((occupant, seatIndex) => {
                  const isTaken = Boolean(occupant);
                  const capacity = getTableCapacity(selectedTable);
                  const seatLabels = [
                    t("tables.seats.head"),
                    t("tables.seats.left1"),
                    t("tables.seats.left2"),
                    t("tables.seats.left3"),
                    t("tables.seats.left4"),
                    t("tables.seats.right1"),
                    t("tables.seats.right2"),
                    t("tables.seats.right3"),
                    t("tables.seats.right4"),
                    t("tables.seats.foot"),
                  ];

                  if (selectedTable.name === SWEETHEART_TABLE_NAME) {
                    return (
                      <button
                        key={seatIndex}
                        type="button"
                        disabled={isTaken}
                        onClick={() => handlePickSeat(seatIndex)}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                          isTaken
                            ? "opacity-40 cursor-not-allowed border-[#eadde2]"
                            : "border-[#660033] bg-white hover:bg-[#fff0f3]"
                        }`}
                      >
                        {seatIndex === 0
                          ? t("tables.seats.left")
                          : t("tables.seats.right")}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={seatIndex}
                      type="button"
                      disabled={isTaken}
                      onClick={() => handlePickSeat(seatIndex)}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        isTaken
                          ? "opacity-40 cursor-not-allowed border-[#eadde2]"
                          : "border-[#660033] bg-white hover:bg-[#fff0f3]"
                      }`}
                    >
                      {capacity === 10
                        ? seatLabels[seatIndex]
                        : `${t("tables.seatNumber")} ${seatIndex + 1}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 mt-6 shrink-0">
          {selectedTable && (
            <button
              type="button"
              onClick={() => setSelectedTableId(null)}
              className="w-full wos-secondary-btn py-3 active:scale-95 transition"
            >
              {t("tables.backToTables")}
            </button>
          )}

          {seatedTable && !selectedTable && (
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
            onClick={handleClose}
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
