const statusOptions = ["all", "pending", "confirmed", "maybe", "declined"];

const sideOptions = [
  {
    value: "all",
    label: "All sides",
    className: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    activeClassName: "bg-black text-white",
  },
  {
    value: "bride",
    label: "Bride",
    className: "bg-rose-50 text-black-700 hover:bg-rose-100",
    activeClassName: "bg-rose-500 text-white",
  },
  {
    value: "groom",
    label: "Groom",
    className: "bg-blue-50 text-black-700 hover:bg-blue-100",
    activeClassName: "bg-blue-500 text-white",
  },
  {
    value: "both",
    label: "Both",
    className: "bg-amber-50 text-black-700 hover:bg-amber-100",
    activeClassName: "bg-amber-500 text-white",
  },
];

function GuestFilters({
  search,
  setSearch,
  status,
  setStatus,
  sideFilter,
  setSideFilter,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="wos-card rounded-3xl p-4 border border-black/5 shadow-sm flex flex-col gap-4">
      <input
        type="text"
        placeholder="Search guests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
      />

      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-medium text-gray-400 mb-2">RSVP status</p>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
                  status === item
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 mb-2">Wedding side</p>

          <div className="flex flex-wrap gap-2">
            {sideOptions.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setSideFilter(item.value)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
                  sideFilter === item.value
                    ? "bg-[#660033] text-white"
                    : item.className
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-fit border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition wos-card text-sm"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>
    </div>
  );
}

export default GuestFilters;
