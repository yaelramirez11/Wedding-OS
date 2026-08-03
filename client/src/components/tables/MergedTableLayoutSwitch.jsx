import { useTranslation } from "../../context/PreferencesContext.jsx";

function MergedTableLayoutSwitch({ enabled, disabled, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="wos-table-layout-switch-row">
      <div className="wos-table-layout-switch-copy">
        <p className="wos-table-layout-switch-label">
          {t("tables.dualHeadLayoutLabel")}
        </p>
        <p className="wos-table-layout-switch-hint">
          {t("tables.dualHeadLayoutHint")}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={t("tables.dualHeadLayoutLabel")}
        disabled={disabled}
        onClick={() => onChange(!enabled)}
        className={`wos-budget-scope-switch wos-table-layout-switch${
          enabled ? " is-on" : ""
        }`}
      >
        <span className="wos-budget-scope-switch-track" aria-hidden="true">
          <span className="wos-budget-scope-switch-thumb" />
        </span>
        <span className="wos-budget-scope-switch-text">
          {enabled
            ? t("tables.dualHeadLayoutOn")
            : t("tables.dualHeadLayoutOff")}
        </span>
      </button>
    </div>
  );
}

export default MergedTableLayoutSwitch;
