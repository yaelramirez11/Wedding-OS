import { useTranslation } from "../../context/PreferencesContext.jsx";

const genderOptions = [
  { value: "male", labelKey: "gender.men" },
  { value: "female", labelKey: "gender.women" },
];

function GuestGenderPicker({
  value,
  onChange,
  disabled = false,
  allowUnset = false,
  unsetLabelKey = "gender.unset",
  className = "",
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`wos-gender-filter wos-gender-picker ${className}`.trim()}
      role="group"
      aria-label={t("gender.label")}
    >
      {allowUnset && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(null)}
          className={`wos-gender-filter-btn ${!value ? "is-active" : ""}`}
        >
          {t(unsetLabelKey)}
        </button>
      )}

      {genderOptions.map((item) => (
        <button
          key={item.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(item.value)}
          className={`wos-gender-filter-btn ${value === item.value ? "is-active" : ""}`}
        >
          {t(item.labelKey)}
        </button>
      ))}
    </div>
  );
}

export default GuestGenderPicker;
