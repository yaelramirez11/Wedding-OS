import { usePreferences } from "../context/PreferencesContext.jsx";

function PreferenceControls({ compact = false }) {
  const { language, theme, setLanguage, setTheme, t } = usePreferences();

  const buttonClass = (isActive) =>
    `px-3 py-1.5 rounded-full text-xs font-semibold transition ${
      isActive
        ? "bg-[#660033] text-white"
        : "bg-black/5 text-[var(--wos-muted)] hover:bg-black/10"
    }`;

  const darkButtonClass = (isActive) =>
    `px-3 py-1.5 rounded-full text-xs font-semibold transition ${
      isActive
        ? "bg-white text-[#660033]"
        : "bg-white/10 text-white/70 hover:bg-white/20"
    }`;

  const isDarkSidebar = compact;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${compact ? "" : "justify-end"}`}
    >
      <div
        className={`flex items-center gap-1 rounded-full p-1 ${
          isDarkSidebar ? "bg-white/10" : "bg-black/5"
        }`}
        role="group"
        aria-label={t("preferences.language")}
      >
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={
            isDarkSidebar
              ? darkButtonClass(language === "en")
              : buttonClass(language === "en")
          }
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage("es")}
          className={
            isDarkSidebar
              ? darkButtonClass(language === "es")
              : buttonClass(language === "es")
          }
        >
          ES
        </button>
      </div>

      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
          isDarkSidebar
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-black/5 text-[var(--wos-muted)] hover:bg-black/10"
        }`}
        aria-label={t("preferences.theme")}
        title={theme === "dark" ? t("preferences.light") : t("preferences.dark")}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </div>
  );
}

export default PreferenceControls;
