import { useEffect, useState } from "react";

import {
  fetchTables,
  fetchUnseatedGuests,
  createTable,
  assignGuestToTable,
} from "../services/tableService";

const defaultTables = [
  { name: "Table 1", label: "Family", order: 1 },
  { name: "Table 2", label: "Friends", order: 2 },
  { name: "Table 3", label: "Bride side", order: 3 },
  { name: "Table 4", label: "Groom side", order: 4 },
  { name: "Table 5", label: "Family", order: 5 },
  { name: "Table 6", label: "Friends", order: 6 },
  { name: "Table 7", label: "Special guests", order: 7 },
  { name: "Table 8", label: "Special guests", order: 8 },
  { name: "Sweetheart Table", label: "Bride & Groom", order: 9 },
];

function TablesPage() {
  const [tables, setTables] = useState([]);
  const [unseatedGuests, setUnseatedGuests] = useState([]);
  const [draggedGuest, setDraggedGuest] = useState(null);
  const [message, setMessage] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);

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
      setMessage("Could not load seating planner.");
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
    .filter((table) => table.name !== "Sweetheart Table")
    .sort((a, b) => a.order - b.order);

  const sweetheartTable = tables.find(
    (table) => table.name === "Sweetheart Table",
  );

  const handleSeedTables = async () => {
    try {
      setIsSeeding(true);

      for (const table of defaultTables) {
        await createTable(table);
      }

      await loadTablesData();
      setMessage("Tables created successfully 💗");
    } catch (error) {
      console.error(error);
      setMessage("Could not create tables.");
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

      setMessage(`${draggedGuest.name} seated at ${table.name}`);
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

      setMessage(`${draggedGuest.name} moved back to unseated`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setDraggedGuest(null);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const renderGuestChip = (guest, variant = "light") => {
    return (
      <div
        key={guest.id}
        draggable
        onDragStart={() => handleDragStart(guest)}
        className={`cursor-grab active:cursor-grabbing rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm border transition hover:-translate-y-0.5 ${
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
    const isFull = table.guests.length >= table.capacity;
    const progress = Math.min(
      100,
      Math.round((table.guests.length / table.capacity) * 100),
    );

    return (
      <article
        key={table.id}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDropOnTable(table)}
        className={`relative rounded-[2rem] border p-5 transition ${
          isSweetheart
            ? "min-h-[280px] bg-gradient-to-br from-[#660033] to-[#38131f] text-white border-[#8c295b] shadow-[0_25px_70px_rgba(102,0,51,0.25)]"
            : "min-h-[260px] bg-white/85 border-[#eadde2] shadow-[0_16px_45px_rgba(80,40,55,0.08)] hover:-translate-y-1"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className={`text-xs font-semibold ${
                isSweetheart ? "text-white/60" : "text-[#8d7380]"
              }`}
            >
              {table.label || "Wedding table"}
            </p>

            <h2
              className={`text-2xl font-serif font-semibold mt-1 ${
                isSweetheart ? "text-white" : "text-[#38131f]"
              }`}
            >
              {table.name}
            </h2>
          </div>

          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isFull
                ? "bg-emerald-100 text-emerald-700"
                : isSweetheart
                  ? "bg-white/10 text-white"
                  : "bg-[#fff8fa] text-[#8d7380]"
            }`}
          >
            {table.guests.length}/{table.capacity}
          </div>
        </div>

        <div
          className={`mt-4 h-2 rounded-full overflow-hidden ${
            isSweetheart ? "bg-white/15" : "bg-[#f7e8ed]"
          }`}
        >
          <div
            className={`h-full rounded-full ${
              isFull ? "bg-emerald-500" : "bg-[#c89b5f]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {table.guests.map((guest) =>
            renderGuestChip(guest, isSweetheart ? "dark" : "light"),
          )}

          {Array.from({
            length: Math.max(0, table.capacity - table.guests.length),
          }).map((_, index) => (
            <div
              key={index}
              className={`rounded-full border border-dashed px-3 py-1.5 text-xs text-center ${
                isSweetheart
                  ? "border-white/20 text-white/35"
                  : "border-[#eadde2] text-[#c6aeb7]"
              }`}
            >
              Empty
            </div>
          ))}
        </div>

        {isFull && (
          <div
            className={`absolute bottom-4 right-4 text-xs font-semibold rounded-full px-3 py-1 ${
              isSweetheart
                ? "bg-white text-[#660033]"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            ✓ Full
          </div>
        )}
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
            Our seating planner 🪑
          </p>

          <h1 className="text-[#38131f] text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            Every guest, beautifully seated.
          </h1>

          <p className="text-[#7f7079] text-lg mt-6 leading-relaxed max-w-2xl">
            Drag guests into tables, keep every table at exactly ten seats, and
            organize our reception layout with love.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">Total guests</p>
          <h2 className="text-4xl font-bold mt-2">{totalGuests}</h2>
        </div>

        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">Full tables</p>
          <h2 className="text-4xl font-bold mt-2">
            {fullTables}/{tables.length}
          </h2>
        </div>

        <div className="wos-card p-6">
          <p className="text-sm text-[#8d7380]">Guests seated</p>
          <h2 className="text-4xl font-bold mt-2">
            {seatedGuests} ({seatedPercentage}%)
          </h2>
        </div>
      </section>

      {tables.length === 0 && (
        <section className="wos-soft-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif text-[#38131f]">
              Create our table layout
            </h2>
            <p className="text-sm text-[#7f7079] mt-1">
              This will create 8 guest tables plus the sweetheart table.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSeedTables}
            disabled={isSeeding}
            className="wos-button"
          >
            {isSeeding ? "Creating..." : "Create Tables"}
          </button>
        </section>
      )}

      <section className="grid grid-cols-1 2xl:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="wos-card p-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-[#8d7380]">Flexible table map</p>
              <h2 className="text-3xl font-serif text-[#38131f] mt-2">
                Reception layout
              </h2>
            </div>

            <p className="text-sm text-[#8d7380]">
              Drag guests into any table. Max 10 per table.
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
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnUnseated}
          className="wos-card p-6 sticky top-28"
        >
          <div>
            <p className="text-sm text-[#8d7380]">Not seated yet</p>
            <h2 className="text-3xl font-serif text-[#38131f] mt-2">
              Unseated guests
            </h2>
          </div>

          <div className="mt-6 max-h-[620px] overflow-y-auto pr-2 space-y-2">
            {unseatedGuests.length === 0 ? (
              <div className="rounded-3xl border border-[#eadde2] bg-[#fff8fa] p-5 text-center">
                <p className="text-sm font-semibold text-[#38131f]">
                  Everyone is seated ✨
                </p>
                <p className="text-xs text-[#8d7380] mt-1">
                  Drag someone back here to unseat them.
                </p>
              </div>
            ) : (
              unseatedGuests.map((guest) => (
                <div
                  key={guest.id}
                  draggable
                  onDragStart={() => handleDragStart(guest)}
                  className="cursor-grab active:cursor-grabbing rounded-2xl bg-[#fff8fa] border border-[#eadde2] px-4 py-3 hover:bg-[#fff0f3] transition"
                >
                  <p className="text-sm font-semibold text-[#38131f]">
                    {guest.name}
                  </p>
                  <p className="text-xs text-[#8d7380] mt-1">
                    {guest.side} side · {guest.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}

export default TablesPage;
