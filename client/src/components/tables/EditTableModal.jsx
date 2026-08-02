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

function EditTableModal({
  open,
  table,
  onClose,
  onSave,
  onSplit,
  saving,
  splitting,
}) {
  const { t } = useTranslation();
  const isSweetheart = table?.name === SWEETHEART_TABLE_NAME;
  const labelOptions = useMemo(
    () => getTableLabelOptions(t, { includeBrideAndGroom: isSweetheart }),
    [t, isSweetheart],
  );
  const isMerged = Boolean(table?.mergeMeta);

  const [tableNumber, setTableNumber] = useState("");
  const [customName, setCustomName] = useState("");
  const [useCustomName, setUseCustomName] = useState(false);
  const [labelValue, setLabelValue] = useState("family");
  const [order, setOrder] = useState(1);
  const [capacity, setCapacity] = useState(10);

  useEffect(() => {
    if (!open || !table) return;

    const parsedNumber = parseTableNumber(table.name);
    setTableNumber(parsedNumber === "" ? "" : String(parsedNumber));
    setCustomName(table.name);
    setUseCustomName(parsedNumber === "");
    setLabelValue(resolveTableLabelValue(table.label, labelOptions));
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
      name: isSweetheart || isMerged ? undefined : name,
      label: resolveTableLabelText(labelValue, labelOptions),
      order: Number(order) || table.order,
      capacity: isSweetheart || isMerged ? undefined : Number(capacity),
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

        {isMerged && (
          <div className="mt-5 rounded-2xl border border-[#eadde2] bg-[#fff8fa] px-4 py-4">
            <p className="text-sm font-medium wos-text-heading">
              {t("tables.mergedTableNotice")}
            </p>
            <p className="text-xs wos-text-muted mt-2 leading-relaxed">
              {t("tables.mergedTableNoticeHint")}
            </p>
            <button
              type="button"
              onClick={onSplit}
              disabled={splitting}
              className="mt-4 w-full rounded-2xl border border-[#660033]/15 bg-white px-4 py-3 text-sm font-semibold text-[#660033] transition hover:bg-[#fff0f3] disabled:opacity-50"
            >
              {splitting ? t("tables.splittingTables") : t("tables.splitTables")}
            </button>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {!isSweetheart && !isMerged && (
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
