function GuestForm({
  name,
  setName,
  side,
  setSide,
  plusOneAllowed,
  setPlusOneAllowed,
  notes,
  setNotes,
  loading,
  onSubmit,
}) {
  const trimmedName = name.trim();
  const isValid = trimmedName.length >= 3;
  const showError = trimmedName.length > 0 && trimmedName.length < 3;

  return (
    <form
      onSubmit={onSubmit}
      className="wos-card p-6 xl:sticky xl:top-28 overflow-hidden relative"
    >
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#fff0f3]" />

      <div className="relative z-10">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-semibold text-[#38131f]">
            Add a guest
          </h2>

          <p className="text-sm text-[#7f7079] mt-2">
            Add someone to our wedding guest list.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Guest name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`wos-input ${showError ? "border-red-400" : ""}`}
            />

            {showError && (
              <p className="text-sm text-red-500 mt-2">
                The name must have at least 3 characters, darling
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-[#8d7380] mb-2">
              Wedding side
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                {
                  value: "bride",
                  label: "Bride",
                  className: "bg-rose-100 text-black-700",
                },
                {
                  value: "groom",
                  label: "Groom",
                  className: "bg-blue-50 text-black-700",
                },
                {
                  value: "both",
                  label: "Both",
                  className: "bg-amber-50 text-black-700",
                },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSide(item.value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    side === item.value
                      ? "bg-[#660033] text-white"
                      : item.className
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between gap-4 rounded-2xl border border-[#eadde2] px-4 py-3 cursor-pointer hover:bg-[#fff8fa] transition">
            <div>
              <p className="text-sm font-semibold text-[#38131f]">
                Plus one allowed
              </p>
              <p className="text-xs text-[#8d7380]">
                Can this guest bring someone?
              </p>
            </div>

            <input
              type="checkbox"
              checked={plusOneAllowed}
              onChange={(e) => setPlusOneAllowed(e.target.checked)}
              className="h-5 w-5 accent-[#660033]"
            />
          </label>

          <textarea
            placeholder="Notes, darling..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={300}
            rows={4}
            className="wos-input resize-none"
          />

          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full wos-button"
          >
            {loading ? "Adding..." : "Add Guest"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default GuestForm;
