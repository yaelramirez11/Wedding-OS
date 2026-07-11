import { useTranslation } from "../../context/PreferencesContext.jsx";

const statusOptions = ["all", "pending", "confirmed", "maybe", "declined"];

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
  const { t } = useTranslation();

  const sideOptions = [
    {
      value: "all",
      labelKey: "side.allSides",
      className: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    },
    {
      value: "bride",
      labelKey: "side.bride",
      className: "bg-rose-50 text-black-700 hover:bg-rose-100",
    },
    {
      value: "groom",
      labelKey: "side.groom",
      className: "bg-blue-50 text-black-700 hover:bg-blue-100",
    },
    {
      value: "both",
      labelKey: "side.both",
      className: "bg-amber-50 text-black-700 hover:bg-amber-100",
    },
  ];

  return (
    <div className="wos-card rounded-3xl p-4 border border-black/5 shadow-sm flex flex-col gap-4">
      <input
        type="text"
        placeholder={t("guests.searchPlaceholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition wos-input"
      />

      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-medium text-gray-400 mb-2">
            {t("guests.rsvpStatus")}
          </p>

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
                {t(`status.${item}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 mb-2">
            {t("guests.weddingSide")}
          </p>

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
                {t(item.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-fit border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition wos-card text-sm"
        >
          <option value="newest">{t("sort.newest")}</option>
          <option value="oldest">{t("sort.oldest")}</option>
          <option value="name">{t("sort.name")}</option>
        </select>
      </div>
    </div>
  );
}

export default GuestFilters;
