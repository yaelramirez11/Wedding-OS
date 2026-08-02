import { useEffect, useMemo, useState } from "react";

import { useTranslation } from "../../context/PreferencesContext.jsx";
import {
  getTableDisplayName,
  getTableLabelOptions,
  parseTableNumber,
  resolveTableLabelText,
  resolveTableLabelValue,
  SWEETHEART_TABLE_NAME,
} from "../../i18n/helpers.js";
import { getTableCapacity } from "./tableSeatingUtils.js";

function EditTableModal({ open, table, onClose, onSave, saving }) {
  const { t } = useTranslation();
  const labelOptions = useMemo(() => getTableLabelOptions(t), [t]);
  const isSweetheart = table?.name === SWEETHEART_TABLE_NAME;

  const [tableNumber, setTableNumber] = useState("");
  const [customName, setCustomName] = useState("");
  const [useCustomName, setUseCustomName] = useState(false);
  const [labelValue, setLabelValue] = useState("family");
  const [customLabel, setCustomLabel] = useState("");
  const [order, setOrder] = useState(1);
  const [capacity, setCapacity] = useState(10);

  useEffect(() => {
    if (!open || !table) return;

    const parsedNumber = parseTableNumber(table.name);
    setTableNumber(parsedNumber === "" ? "" : String(parsedNumber));
    setCustomName(table.name);
    setUseCustomName(parsedNumber === "");
    setLabelValue(resolveTableLabelValue(table.label, labelOptions));
    setCustomLabel(
      resolveTableLabelValue(table.label, labelOptions) === "custom"
        ? table.label || ""
        : "",
    );
    setOrder(table.order ?? 1);
    setCapacity(getTableCapacity(table));
  }, [open, table, labelOptions]);

  if (!open || !table) return null;

  const minCapacity = Math.max(table.guests?.length ?? 0, 1);

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = useCustomName
      ? customName.trim()
      : tableNumber
        ? `Table ${Number(tableNumber)}`
        : customName.trim();

    if (!name) return;

    onSave({
      name: isSweetheart ? undefined : name,
      label: resolveTableLabelText(labelValue, customLabel, labelOptions) || null,
      order: Number(order) || table.order,
      capacity: isSweetheart ? undefined : Number(capacity),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="wos-card rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-semibold wos-text-heading">
          {t("tables.editTableTitle")}
        </h2>

        <p className="wos-text-muted mt-2 leading-relaxed">
          {t("tables.editTableSubtitle")}{" "}
          <span className="font-semibold wos-text-heading">
            {getTableDisplayName(t, table.name)}
          </span>
        </p>

        <div className="mt-6 space-y-4">
          {!isSweetheart && (
            <>
              <label className="block space-y-2">
                <span className="text-sm font-medium wos-text-heading">
                  {t("tables.tableNumber")}
                </span>
                <input
                  type="number"
                  min="1"
                  value={tableNumber}
                  onChange={(event) => {
                    setTableNumber(event.target.value);
                    setUseCustomName(false);
                  }}
                  disabled={useCustomName}
                  className="wos-input"
                />
              </label>

              <label className="flex items-center gap-3 text-sm wos-text-heading">
                <input
                  type="checkbox"
                  checked={useCustomName}
                  onChange={(event) => setUseCustomName(event.target.checked)}
                  className="h-4 w-4 rounded border-[#eadde2]"
                />
                {t("tables.useCustomName")}
              </label>

              {useCustomName && (
                <label className="block space-y-2">
                  <span className="text-sm font-medium wos-text-heading">
                    {t("tables.customTableName")}
                  </span>
                  <input
                    value={customName}
                    onChange={(event) => setCustomName(event.target.value)}
                    className="wos-input"
                  />
                </label>
              )}

              <label className="block space-y-2">
                <span className="text-sm font-medium wos-text-heading">
                  {t("tables.capacity")}
                </span>
                <input
                  type="number"
                  min={minCapacity}
                  max="30"
                  value={capacity}
                  onChange={(event) => setCapacity(event.target.value)}
                  className="wos-input"
                />
                <span className="text-xs wos-text-muted">
                  {t("tables.capacityHint")} {minCapacity}
                </span>
              </label>
            </>
          )}

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
        </div>

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
            disabled={saving}
            className="flex-1 wos-button py-3 disabled:opacity-50"
          >
            {saving ? t("common.loading") : t("common.save")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTableModal;
