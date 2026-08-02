import { useEffect, useMemo, useState } from "react";

import { useTranslation } from "../../context/PreferencesContext.jsx";
import {
  getTableDisplayName,
  getTableLabelOptions,
  resolveTableLabelText,
  resolveTableLabelValue,
} from "../../i18n/helpers.js";
import { getTableCapacity } from "./tableSeatingUtils.js";

function MergeTablesModal({
  open,
  tables,
  onClose,
  onConfirm,
  saving,
}) {
  const { t } = useTranslation();
  const labelOptions = useMemo(() => getTableLabelOptions(t), [t]);
  const regularTables = useMemo(
    () => [...tables].sort((a, b) => a.order - b.order),
    [tables],
  );

  const [primaryTableId, setPrimaryTableId] = useState("");
  const [secondaryTableId, setSecondaryTableId] = useState("");
  const [mergedName, setMergedName] = useState("");
  const [labelValue, setLabelValue] = useState("family");
  const [customLabel, setCustomLabel] = useState("");
  const [order, setOrder] = useState(1);
  const [addExtraSeat, setAddExtraSeat] = useState(false);

  useEffect(() => {
    if (!open) return;

    const first = regularTables[0];
    const second = regularTables[1];

    setPrimaryTableId(first ? String(first.id) : "");
    setSecondaryTableId(second ? String(second.id) : "");
    setMergedName(t("tables.defaultMergedName"));
    setLabelValue("family");
    setCustomLabel("");
    setOrder(first?.order ?? 1);
    setAddExtraSeat(false);
  }, [open, regularTables, t]);

  if (!open) return null;

  const primaryTable = regularTables.find(
    (table) => String(table.id) === primaryTableId,
  );
  const secondaryTable = regularTables.find(
    (table) => String(table.id) === secondaryTableId,
  );

  const baseCapacity =
    (primaryTable ? getTableCapacity(primaryTable) : 0) +
    (secondaryTable ? getTableCapacity(secondaryTable) : 0);
  const mergedCapacity = baseCapacity + (addExtraSeat ? 1 : 0);
  const mergedGuests =
    (primaryTable?.guests.length ?? 0) + (secondaryTable?.guests.length ?? 0);
  const canSubmit =
    primaryTable &&
    secondaryTable &&
    primaryTable.id !== secondaryTable.id &&
    mergedName.trim() &&
    mergedGuests <= mergedCapacity;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    onConfirm({
      primaryTableId: primaryTable.id,
      secondaryTableId: secondaryTable.id,
      name: mergedName.trim(),
      label: resolveTableLabelText(labelValue, customLabel, labelOptions) || null,
      order: Number(order) || primaryTable.order,
      addExtraSeat,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="wos-card rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-semibold wos-text-heading">
          {t("tables.mergeTablesTitle")}
        </h2>

        <p className="wos-text-muted mt-2 leading-relaxed">
          {t("tables.mergeTablesSubtitle")}
        </p>

        {regularTables.length < 2 ? (
          <p className="mt-6 text-sm wos-text-muted">{t("tables.mergeNeedsTwo")}</p>
        ) : (
          <div className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium wos-text-heading">
                {t("tables.mergePrimaryTable")}
              </span>
              <select
                value={primaryTableId}
                onChange={(event) => setPrimaryTableId(event.target.value)}
                className="wos-input"
              >
                {regularTables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {getTableDisplayName(t, table.name)} ·{" "}
                    {table.label || t("tables.defaultTableLabel")}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium wos-text-heading">
                {t("tables.mergeSecondaryTable")}
              </span>
              <select
                value={secondaryTableId}
                onChange={(event) => setSecondaryTableId(event.target.value)}
                className="wos-input"
              >
                {regularTables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {getTableDisplayName(t, table.name)} ·{" "}
                    {table.label || t("tables.defaultTableLabel")}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium wos-text-heading">
                {t("tables.mergedTableName")}
              </span>
              <input
                value={mergedName}
                onChange={(event) => setMergedName(event.target.value)}
                className="wos-input"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium wos-text-heading">
                {t("tables.groupLabel")}
              </span>
              <select
                value={labelValue}
                onChange={(event) => setLabelValue(event.target.value)}
                className="wos-input"
              >
                {labelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {labelValue === "custom" && (
              <label className="block space-y-2">
                <span className="text-sm font-medium wos-text-heading">
                  {t("tables.customGroupLabel")}
                </span>
                <input
                  value={customLabel}
                  onChange={(event) => setCustomLabel(event.target.value)}
                  className="wos-input"
                />
              </label>
            )}

            <label className="block space-y-2">
              <span className="text-sm font-medium wos-text-heading">
                {t("tables.displayOrder")}
              </span>
              <input
                type="number"
                min="1"
                value={order}
                onChange={(event) => setOrder(event.target.value)}
                className="wos-input"
              />
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-[#eadde2] bg-[#fff8fa] px-4 py-3">
              <input
                type="checkbox"
                checked={addExtraSeat}
                onChange={(event) => setAddExtraSeat(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#eadde2]"
              />
              <span>
                <span className="block text-sm font-medium wos-text-heading">
                  {t("tables.addExtraSeat")}
                </span>
                <span className="block text-xs wos-text-muted mt-1">
                  {t("tables.addExtraSeatHint")} {baseCapacity} →{" "}
                  {baseCapacity + 1}
                </span>
              </span>
            </label>

            <div className="rounded-2xl border border-[#eadde2] bg-[#fff8fa] px-4 py-3 text-sm wos-text-muted">
              <p>
                {t("tables.mergePreviewGuests")}:{" "}
                <span className="font-semibold wos-text-heading">{mergedGuests}</span>
              </p>
              <p className="mt-1">
                {t("tables.mergePreviewCapacity")}:{" "}
                <span className="font-semibold wos-text-heading">
                  {mergedCapacity}
                </span>
              </p>
              {mergedGuests > mergedCapacity && (
                <p className="mt-2 text-red-600">{t("tables.mergeCapacityError")}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 wos-secondary-btn py-3 active:scale-95 transition"
          >
            {t("common.cancel")}
          </button>

          <button
            type="submit"
            disabled={saving || !canSubmit}
            className="flex-1 wos-button py-3 disabled:opacity-50"
          >
            {saving ? t("tables.mergingTables") : t("tables.mergeTablesConfirm")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MergeTablesModal;
