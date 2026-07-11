import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { translate } from "../i18n/translations.js";

const PreferencesContext = createContext(null);

const LANGUAGE_KEY = "wos-language";
const THEME_KEY = "wos-theme";

const getInitialLanguage = () => {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  return stored === "es" ? "es" : "en";
};

const getInitialTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function PreferencesProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.lang = language;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, language]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  const t = (key) => translate(language, key);

  const value = useMemo(
    () => ({
      language,
      theme,
      setLanguage,
      setTheme,
      toggleTheme: () =>
        setTheme((current) => (current === "dark" ? "light" : "dark")),
      t,
    }),
    [language, theme],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }

  return context;
}

export function useTranslation() {
  const { t, language } = usePreferences();
  return { t, language };
}
