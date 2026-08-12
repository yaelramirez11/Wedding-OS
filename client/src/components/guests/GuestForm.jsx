import { useTranslation } from "../../context/PreferencesContext.jsx";

function GuestForm({
  name,
  setName,
  side,
  setSide,
  gender,
  setGender,
  plusOneAllowed,
  setPlusOneAllowed,
  notes,
  setNotes,
  loading,
  onSubmit,
}) {
  const { t } = useTranslation();
  const trimmedName = name.trim();
  const isValid = trimmedName.length >= 3;
  const showError = trimmedName.length > 0 && trimmedName.length < 3;

  const sideOptions = [
    { value: "bride", labelKey: "side.bride", className: "bg-rose-100 text-black-700" },
    { value: "groom", labelKey: "side.groom", className: "bg-blue-50 text-black-700" },
    { value: "both", labelKey: "side.both", className: "bg-amber-50 text-black-700" },
  ];

  const genderOptions = [
    { value: "female", labelKey: "gender.woman", className: "bg-pink-50 text-pink-800" },
    { value: "male", labelKey: "gender.man", className: "bg-sky-50 text-sky-800" },
  ];

  return (
    <form
      onSubmit={onSubmit}
      className="wos-card p-6 wos-sticky-panel overflow-hidden relative"
    >
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[var(--wos-rose-soft)]" />

      <div className="relative z-10">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-semibold wos-text-heading">
            {t("guests.addGuest")}
          </h2>

          <p className="text-sm wos-text-muted mt-2">
            {t("guests.addGuestSubtitle")}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder={t("guests.guestName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`wos-input ${showError ? "border-red-400" : ""}`}
            />

            {showError && (
              <p className="text-sm text-red-500 mt-2">{t("guests.nameMinError")}</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold wos-text-muted mb-2">
              {t("guests.weddingSide")}
            </p>

            <div className="flex flex-wrap gap-2">
              {sideOptions.map((item) => (
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
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold wos-text-muted mb-2">
              {t("guests.guestGender")}
            </p>

            <div className="wos-gender-filter wos-gender-filter-form">
              <button
                type="button"
                onClick={() => setGender("")}
                className={`wos-gender-filter-btn ${
                  gender === "" ? "is-active" : ""
                }`}
              >
                {t("gender.unset")}
              </button>

              {genderOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setGender(item.value)}
                  className={`wos-gender-filter-btn ${
                    gender === item.value ? "is-active" : ""
                  }`}
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--wos-border-soft)] px-4 py-3 cursor-pointer hover:bg-[var(--wos-surface-soft)] transition">
            <div>
              <p className="text-sm font-semibold wos-text-heading">
                {t("guests.plusOne")}
              </p>
              <p className="text-xs wos-text-muted">{t("guests.plusOneHint")}</p>
            </div>

            <input
              type="checkbox"
              checked={plusOneAllowed}
              onChange={(e) => setPlusOneAllowed(e.target.checked)}
              className="h-5 w-5 accent-[#660033]"
            />
          </label>

          <textarea
            placeholder={t("common.notesPlaceholder")}
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
            {loading ? t("common.adding") : t("guests.addGuestBtn")}
          </button>
        </div>
      </div>
    </form>
  );
}

export default GuestForm;
