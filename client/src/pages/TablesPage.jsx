import { useEffect, useMemo, useState } from "react";

import SeatGuestModal from "../components/tables/SeatGuestModal.jsx";
import { useIsMobile } from "../hooks/useIsMobile.js";
import {
  fetchTables,
  fetchUnseatedGuests,
  createTable,
  assignGuestToTable,
} from "../services/tableService";
import { useTranslation } from "../context/PreferencesContext.jsx";
import {
  getDefaultTableLabels,
  getGuestSideConfig,
  getGuestStatusConfig,
  getTableDisplayName,
  SWEETHEART_TABLE_NAME,
} from "../i18n/helpers.js";

function TablesPage() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const defaultTables = useMemo(() => getDefaultTableLabels(t), [t]);
  const sideConfig = useMemo(() => getGuestSideConfig(t), [t]);
  const statusConfig = useMemo(() => getGuestStatusConfig(t), [t]);

  const [tables, setTables] = useState([]);
  const [unseatedGuests, setUnseatedGuests] = useState([]);
  const [draggedGuest, setDraggedGuest] = useState(null);
  const [message, setMessage] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);
  const [seatModalGuest, setSeatModalGuest] = useState(null);

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

  const handleSeatGuestAtTable = async (table) => {
    if (!seatModalGuest) return;

    const guest = seatModalGuest;

    try {
      await assignGuestToTable(guest.id, table.id);
      await loadTablesData();

      setMessage(
        `${guest.name} ${t("tables.seatedAt")} ${getTableDisplayName(t, table.name)}`,
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSeatModalGuest(null);
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
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const openSeatModal = (guest) => {
    if (isMobile) {
      setSeatModalGuest(guest);
    }
  };

  const renderGuestChip = (guest, variant = "light") => {
    const dragProps = isMobile
      ? {}
      : {
          draggable: true,
          onDragStart: () => handleDragStart(guest),
        };

    return (
      <div
        key={guest.id}
        {...dragProps}
        role={isMobile ? "button" : undefined}
        tabIndex={isMobile ? 0 : undefined}
        onClick={isMobile ? () => openSeatModal(guest) : undefined}
        onKeyDown={
          isMobile
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openSeatModal(guest);
                }
              }
            : undefined
        }
        className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm border transition hover:-translate-y-0.5 ${
          isMobile
            ? "cursor-pointer active:scale-95"
            : "cursor-grab active:cursor-grabbing"
        } ${
          variant === "dark"
            ? "bg-[#660033] text-white border-[#660033]"
            : "bg-[#fff0f3] text-[#38131f] border-[#eadde2]"
        }`}
      >
        {guest.name}
      </div>
    );
  };

  const renderTable = (table, isSweetheart = false) => {
    const effectiveCapacity = isSweetheart ? 2 : 10;
    const isFull = table.guests.length >= effectiveCapacity;

    const progress = Math.min(
      100,
      Math.round((table.guests.length / effectiveCapacity) * 100),
    );

    return (
      <article
        key={table.id}
        onDragOver={isMobile ? undefined : (event) => event.preventDefault()}
        onDrop={isMobile ? undefined : () => handleDropOnTable(table)}
        className={`relative overflow-hidden border transition ${
          isSweetheart
            ? "rounded-[2.5rem] bg-gradient-to-br from-[#660033] to-[#38131f] text-white border-[#8c295b] shadow-[0_25px_70px_rgba(102,0,51,0.25)] p-6 min-h-[220px]"
            : "rounded-[2.25rem] bg-white/90 border-[#eadde2] shadow-[0_16px_45px_rgba(80,40,55,0.08)] hover:-translate-y-1 p-5 min-h-[220px]"
        }`}
      >
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#fff0f3]/40" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className={`text-xs font-semibold ${
                  isSweetheart ? "text-white/60" : "text-[#8d7380]"
                }`}
              >
                {table.label || t("tables.defaultTableLabel")}
              </p>

              <h2
                className={`text-2xl font-serif font-semibold mt-1 ${
                  isSweetheart ? "text-white" : "wos-text-heading"
                }`}
              >
                {getTableDisplayName(t, table.name)}
              </h2>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isFull
                  ? "bg-emerald-100 text-emerald-700"
                  : isSweetheart
                    ? "bg-white/10 text-white"
                    : "bg-[#fff8fa] text-[#8d7380]"
              }`}
            >
              {table.guests.length}/{effectiveCapacity}
            </span>
          </div>

          <div
            className={`mt-4 h-2 rounded-full overflow-hidden ${
              isSweetheart ? "bg-white/15" : "bg-[#f7e8ed]"
            }`}
          >
            <div
              className={`h-full rounded-full ${
                isFull ? "bg-emerald-500" : "bg-[#660033]"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2">
            {table.guests.map((guest) =>
              renderGuestChip(guest, isSweetheart ? "dark" : "light"),
            )}

            {Array.from({
              length: Math.max(0, effectiveCapacity - table.guests.length),
            }).map((_, index) => (
              <div
                key={index}
                className={`rounded-2xl border border-dashed px-3 py-2 text-xs text-center ${
                  isSweetheart
                    ? "border-white/20 text-white/35"
                    : "border-[#eadde2] text-[#c6aeb7]"
                }`}
              >
                {t("tables.emptySeat")}
              </div>
            ))}
          </div>
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

      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#fff0f3] via-[#fff8fa] to-[#f3edf8] border border-[#eadde2] p-8 lg:p-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/50" />
        <div className="absolute right-24 -bottom-28 h-80 w-80 rounded-full bg-[#f2c8d4]/35" />

        <div className="relative z-10 max-w-3xl">
          <p className="text-[#8d7380] text-sm font-medium mb-5">
            {t("tables.eyebrow")}
          </p>

          <h1 className="wos-text-heading text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
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
          <h2 className="text-4xl font-bold mt-2 wos-text-heading">
            {totalGuests}
          </h2>
        </div>

        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">{t("tables.fullTables")}</p>
          <h2 className="text-4xl font-bold mt-2 wos-text-heading">
            {fullTables}/{tables.length}
          </h2>
        </div>

        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">{t("tables.guestsSeated")}</p>
          <h2 className="text-4xl font-bold mt-2 wos-text-heading">
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

            <p className="text-sm text-[#8d7380]">
              {isMobile ? t("tables.tapHint") : t("tables.dragHint")}
            </p>
          </div>

          <div className="relative rounded-[2rem] border border-[#eadde2] bg-gradient-to-br from-[#fffafa] via-[#fff6f8] to-[#f8eef2] p-6 lg:p-8 min-h-[740px]">
            <div className="absolute inset-8 rounded-[1.5rem] border border-[#eadde2]/70 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
          onDragOver={isMobile ? undefined : (event) => event.preventDefault()}
          onDrop={isMobile ? undefined : handleDropOnUnseated}
          className="wos-card p-6 sticky top-28"
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
                  {isMobile ? t("tables.unseatTapHint") : t("tables.unseatHint")}
                </p>
              </div>
            ) : (
              unseatedGuests.map((guest) => (
                <div
                  key={guest.id}
                  draggable={!isMobile}
                  onDragStart={
                    isMobile ? undefined : () => handleDragStart(guest)
                  }
                  role={isMobile ? "button" : undefined}
                  tabIndex={isMobile ? 0 : undefined}
                  onClick={isMobile ? () => openSeatModal(guest) : undefined}
                  onKeyDown={
                    isMobile
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openSeatModal(guest);
                          }
                        }
                      : undefined
                  }
                  className={`rounded-2xl bg-[#fff8fa] border border-[#eadde2] px-4 py-3 transition ${
                    isMobile
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
        onSelectTable={handleSeatGuestAtTable}
        onUnseat={handleUnseatFromModal}
      />
    </div>
  );
}

export default TablesPage;
