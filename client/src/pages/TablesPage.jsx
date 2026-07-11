import { useEffect, useMemo, useState } from "react";

import SeatGuestModal from "../components/tables/SeatGuestModal.jsx";
import DeleteTableModal from "../components/tables/DeleteTableModal.jsx";
import BanquetTableSeating from "../components/tables/BanquetTableSeating.jsx";
import { usePrefersTapLayout } from "../hooks/usePrefersTapLayout.js";
import {
  fetchTables,
  fetchUnseatedGuests,
  createTable,
  deleteTable,
  assignGuestToTable,
} from "../services/tableService";
import { useTranslation } from "../context/PreferencesContext.jsx";
import {
  getDefaultTableLabels,
  getGuestSideConfig,
  getGuestStatusConfig,
  getNextRegularTableConfig,
  getTableDisplayName,
  SWEETHEART_TABLE_NAME,
} from "../i18n/helpers.js";

function TablesPage() {
  const { t } = useTranslation();
  const prefersTapLayout = usePrefersTapLayout();
  const defaultTables = useMemo(() => getDefaultTableLabels(t), [t]);
  const sideConfig = useMemo(() => getGuestSideConfig(t), [t]);
  const statusConfig = useMemo(() => getGuestStatusConfig(t), [t]);

  const [tables, setTables] = useState([]);
  const [unseatedGuests, setUnseatedGuests] = useState([]);
  const [draggedGuest, setDraggedGuest] = useState(null);
  const [message, setMessage] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);
  const [seatModalGuest, setSeatModalGuest] = useState(null);
  const [selectedGuestId, setSelectedGuestId] = useState(null);

  useEffect(() => {
    loadTablesData();
  }, []);

  const loadTablesData = async () => {
    try {
      const [tablesData, guestsData] = await Promise.all([
        fetchTables(),
        fetchUnseatedGuests(),
      ]);

      setTables(tablesData);
      setUnseatedGuests(guestsData);
    } catch (error) {
      console.error(error);
      setMessage(t("tables.loadError"));
    }
  };

  const totalGuests =
    tables.reduce((sum, table) => sum + table.guests.length, 0) +
    unseatedGuests.length;

  const seatedGuests = tables.reduce(
    (sum, table) => sum + table.guests.length,
    0,
  );

  const fullTables = tables.filter(
    (table) => table.guests.length >= table.capacity,
  ).length;

  const seatedPercentage =
    totalGuests === 0 ? 0 : Math.round((seatedGuests / totalGuests) * 100);

  const regularTables = tables
    .filter((table) => table.name !== SWEETHEART_TABLE_NAME)
    .sort((a, b) => a.order - b.order);

  const sweetheartTable = tables.find(
    (table) => table.name === SWEETHEART_TABLE_NAME,
  );

  const handleSeedTables = async () => {
    try {
      setIsSeeding(true);

      for (const table of defaultTables) {
        await createTable(table);
      }

      await loadTablesData();
      setMessage(t("tables.createSuccess"));
    } catch (error) {
      console.error(error);
      setMessage(t("tables.createError"));
    } finally {
      setIsSeeding(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleAddTable = async () => {
    try {
      setIsAddingTable(true);
      await createTable(getNextRegularTableConfig(t, regularTables));
      await loadTablesData();
      setMessage(t("tables.addTableSuccess"));
    } catch (error) {
      console.error(error);
      setMessage(error.message || t("tables.addTableError"));
    } finally {
      setIsAddingTable(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleConfirmDeleteTable = async () => {
    if (!tableToDelete) return;

    try {
      await deleteTable(tableToDelete.id);
      await loadTablesData();
      setMessage(t("tables.deleteTableSuccess"));
    } catch (error) {
      console.error(error);
      setMessage(error.message || t("tables.deleteTableError"));
    } finally {
      setTableToDelete(null);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleDragStart = (guest) => {
    setDraggedGuest(guest);
  };

  const handleDropOnTable = async (table) => {
    if (!draggedGuest) return;

    try {
      await assignGuestToTable(draggedGuest.id, table.id);
      await loadTablesData();

      setMessage(
        `${draggedGuest.name} ${t("tables.seatedAt")} ${getTableDisplayName(t, table.name)}`,
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setDraggedGuest(null);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleDropOnSeat = async (table, seatIndex) => {
    if (!draggedGuest) return;

    try {
      await assignGuestToTable(draggedGuest.id, table.id, seatIndex);
      await loadTablesData();

      setMessage(
        `${draggedGuest.name} ${t("tables.seatedAt")} ${getTableDisplayName(t, table.name)}`,
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setDraggedGuest(null);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleEmptySeatClick = async (table, seatIndex) => {
    if (!selectedGuestId) return;

    const guest =
      unseatedGuests.find((item) => item.id === selectedGuestId) ||
      tables
        .flatMap((item) => item.guests)
        .find((item) => item.id === selectedGuestId);

    if (!guest) return;

    try {
      await assignGuestToTable(guest.id, table.id, seatIndex);
      await loadTablesData();
      setSelectedGuestId(null);

      setMessage(
        `${guest.name} ${t("tables.seatedAt")} ${getTableDisplayName(t, table.name)}`,
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleDropOnUnseated = async () => {
    if (!draggedGuest) return;

    try {
      await assignGuestToTable(draggedGuest.id, null);
      await loadTablesData();

      setMessage(`${draggedGuest.name} ${t("tables.movedToUnseated")}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setDraggedGuest(null);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleSeatGuestAtSeat = async (table, seatIndex) => {
    if (!seatModalGuest) return;

    const guest = seatModalGuest;

    try {
      await assignGuestToTable(guest.id, table.id, seatIndex);
      await loadTablesData();

      setMessage(
        `${guest.name} ${t("tables.seatedAt")} ${getTableDisplayName(t, table.name)}`,
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSeatModalGuest(null);
      setSelectedGuestId(null);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleUnseatFromModal = async () => {
    if (!seatModalGuest) return;

    const guest = seatModalGuest;

    try {
      await assignGuestToTable(guest.id, null);
      await loadTablesData();

      setMessage(`${guest.name} ${t("tables.movedToUnseated")}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSeatModalGuest(null);
      setSelectedGuestId(null);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const openSeatModal = (guest) => {
    setSeatModalGuest(guest);
    setSelectedGuestId(guest.id);
  };

  const selectGuestForSeating = (guest) => {
    if (prefersTapLayout) {
      openSeatModal(guest);
      return;
    }

    setSelectedGuestId((current) => (current === guest.id ? null : guest.id));
  };

  const renderTable = (table, isSweetheart = false) => {
    const effectiveCapacity = isSweetheart ? 2 : 10;
    const isFull = table.guests.length >= effectiveCapacity;

    return (
      <article
        key={table.id}
        onDragOver={prefersTapLayout ? undefined : (event) => event.preventDefault()}
        onDrop={prefersTapLayout ? undefined : () => handleDropOnTable(table)}
        className={`group relative overflow-hidden border transition wos-table-card ${
          isSweetheart
            ? "rounded-[2.5rem] bg-gradient-to-br from-[#660033] to-[#38131f] text-white border-[#8c295b] shadow-[0_25px_70px_rgba(102,0,51,0.25)] p-6"
            : "wos-table-card-regular rounded-[2rem] p-4 sm:p-5 hover:-translate-y-1"
        }`}
      >
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#fff0f3]/40 wos-table-card-glow" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p
                className={`text-xs font-semibold wos-table-card-label ${
                  isSweetheart ? "text-white/60" : ""
                }`}
              >
                {table.label || t("tables.defaultTableLabel")}
              </p>

              <h2
                className={`text-xl sm:text-2xl font-serif font-semibold mt-1 wos-table-card-title ${
                  isSweetheart ? "text-white" : ""
                }`}
              >
                {getTableDisplayName(t, table.name)}
              </h2>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold wos-table-capacity-badge ${
                  isFull
                    ? "wos-table-capacity-full"
                    : isSweetheart
                      ? "bg-white/10 text-white"
                      : ""
                }`}
              >
                {table.guests.length}/{effectiveCapacity}
              </span>

              {!isSweetheart && (
                <button
                  type="button"
                  onClick={() => setTableToDelete(table)}
                  aria-label={t("tables.deleteTableAria")}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl border wos-table-delete-btn transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 ${
                    prefersTapLayout
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                  }`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7H8z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 11v6M14 11v6"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <BanquetTableSeating
            table={table}
            guests={table.guests}
            capacity={effectiveCapacity}
            isSweetheart={isSweetheart}
            variant={isSweetheart ? "dark" : "light"}
            prefersTapLayout={prefersTapLayout}
            selectedGuestId={selectedGuestId}
            statusConfig={statusConfig}
            emptyLabel={t("tables.emptySeat")}
            onDragStart={handleDragStart}
            onGuestClick={openSeatModal}
            onSeatDrop={handleDropOnSeat}
            onEmptySeatClick={handleEmptySeatClick}
          />
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-8">
      {message && (
        <div className="rounded-2xl bg-[#fff0f3] text-[#660033] border border-[#eadde2] px-5 py-4 text-sm font-semibold">
          {message}
        </div>
      )}

      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#fff0f3] via-[#fff8fa] to-[#f3edf8] border border-[#eadde2] wos-page-hero">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/50" />
        <div className="absolute right-24 -bottom-28 h-80 w-80 rounded-full bg-[#f2c8d4]/35" />

        <div className="relative z-10 max-w-3xl">
          <p className="text-[#8d7380] text-sm font-medium mb-5">
            {t("tables.eyebrow")}
          </p>

          <h1 className="wos-text-heading wos-page-title font-semibold">
            {t("tables.title")}
          </h1>

          <p className="wos-text-muted text-lg mt-6 leading-relaxed max-w-2xl">
            {t("tables.subtitle")}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">{t("tables.totalGuests")}</p>
          <h2 className="wos-stat-value font-bold mt-2 wos-text-heading">
            {totalGuests}
          </h2>
        </div>

        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">{t("tables.fullTables")}</p>
          <h2 className="wos-stat-value font-bold mt-2 wos-text-heading">
            {fullTables}/{tables.length}
          </h2>
        </div>

        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">{t("tables.guestsSeated")}</p>
          <h2 className="wos-stat-value font-bold mt-2 wos-text-heading">
            {seatedGuests} ({seatedPercentage}%)
          </h2>
        </div>
      </section>

      {tables.length === 0 && (
        <section className="wos-soft-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif wos-text-heading">
              {t("tables.createLayout")}
            </h2>
            <p className="text-sm wos-text-muted mt-1">
              {t("tables.createLayoutHint")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSeedTables}
            disabled={isSeeding}
            className="wos-button"
          >
            {isSeeding ? t("tables.creating") : t("tables.createTables")}
          </button>
        </section>
      )}

      <section className="grid grid-cols-1 2xl:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="wos-card p-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-[#8d7380]">{t("tables.flexibleMap")}</p>
              <h2 className="text-3xl font-serif wos-text-heading mt-2">
                {t("tables.receptionLayout")}
              </h2>
            </div>

            <div className="flex flex-col sm:items-end gap-3">
              {tables.length > 0 && (
                <button
                  type="button"
                  onClick={handleAddTable}
                  disabled={isAddingTable}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#eadde2] bg-white/90 px-5 py-2.5 text-sm font-semibold text-[#660033] shadow-[0_8px_24px_rgba(80,40,55,0.06)] transition hover:bg-[#fff8fa] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fff0f3] text-base leading-none">
                    +
                  </span>
                  {isAddingTable ? t("tables.addingTable") : t("tables.addTable")}
                </button>
              )}

              <p className="text-sm text-[#8d7380]">
                {prefersTapLayout ? t("tables.tapHint") : t("tables.dragHint")}
              </p>
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-[#eadde2] bg-gradient-to-br from-[#fffafa] via-[#fff6f8] to-[#f8eef2] wos-table-map">
            <div className="absolute inset-4 sm:inset-8 rounded-[1.5rem] border border-[#eadde2]/70 pointer-events-none hidden sm:block wos-table-map-frame" />

            <div className="relative z-10 grid wos-tables-grid gap-5 sm:gap-6 xl:gap-8">
              {regularTables.map((table) => renderTable(table))}
            </div>

            {sweetheartTable && (
              <div className="relative z-20 mt-8 max-w-md mx-auto">
                {renderTable(sweetheartTable, true)}
              </div>
            )}
          </div>
        </div>

        <aside
          onDragOver={prefersTapLayout ? undefined : (event) => event.preventDefault()}
          onDrop={prefersTapLayout ? undefined : handleDropOnUnseated}
          className="wos-card p-6 wos-sticky-panel"
        >
          <div>
            <p className="text-sm text-[#8d7380]">{t("tables.notSeatedYet")}</p>
            <h2 className="text-3xl font-serif wos-text-heading mt-2">
              {t("tables.unseatedGuests")}
            </h2>
          </div>

          <div className="mt-6 max-h-[620px] overflow-y-auto pr-2 space-y-2">
            {unseatedGuests.length === 0 ? (
              <div className="rounded-3xl border border-[#eadde2] bg-[#fff8fa] p-5 text-center">
                <p className="text-sm font-semibold wos-text-heading">
                  {t("tables.everyoneSeated")}
                </p>
                <p className="text-xs text-[#8d7380] mt-1">
                  {prefersTapLayout ? t("tables.unseatTapHint") : t("tables.unseatHint")}
                </p>
              </div>
            ) : (
              unseatedGuests.map((guest) => (
                <div
                  key={guest.id}
                  draggable={!prefersTapLayout}
                  onDragStart={
                    prefersTapLayout ? undefined : () => handleDragStart(guest)
                  }
                  role="button"
                  tabIndex={0}
                  onClick={() => selectGuestForSeating(guest)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectGuestForSeating(guest);
                    }
                  }}
                  className={`rounded-2xl bg-[#fff8fa] border px-4 py-3 transition ${
                    selectedGuestId === guest.id
                      ? "border-[#660033] bg-[#fff0f3] ring-2 ring-[#660033]/15"
                      : "border-[#eadde2]"
                  } ${
                    prefersTapLayout
                      ? "cursor-pointer active:scale-[0.99] hover:bg-[#fff0f3]"
                      : "cursor-grab active:cursor-grabbing hover:bg-[#fff0f3]"
                  }`}
                >
                  <p className="text-sm font-semibold wos-text-heading">
                    {guest.name}
                  </p>
                  <p className="text-xs text-[#8d7380] mt-1">
                    {sideConfig[guest.side]?.label || sideConfig.both.label} ·{" "}
                    {statusConfig[guest.status]?.label ||
                      statusConfig.pending.label}
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>
      </section>

      <SeatGuestModal
        open={Boolean(seatModalGuest)}
        guest={seatModalGuest}
        tables={tables}
        onClose={() => setSeatModalGuest(null)}
        onSelectSeat={handleSeatGuestAtSeat}
        onUnseat={handleUnseatFromModal}
      />

      <DeleteTableModal
        open={Boolean(tableToDelete)}
        table={tableToDelete}
        onClose={() => setTableToDelete(null)}
        onConfirm={handleConfirmDeleteTable}
      />
    </div>
  );
}

export default TablesPage;
