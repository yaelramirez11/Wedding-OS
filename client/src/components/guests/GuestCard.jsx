import { useState } from "react";

import { useTranslation } from "../../context/PreferencesContext.jsx";
import { getGuestSideConfig, getGuestStatusConfig } from "../../i18n/helpers.js";

function GuestCard({
  guest,
  onChangeStatus,
  onDeleteGuest,
  onUpdateGuestName,
}) {
  const { t } = useTranslation();
  const statusConfig = getGuestStatusConfig(t);
  const sideConfig = getGuestSideConfig(t);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(guest.name);
  const [editedSide, setEditedSide] = useState(guest.side || "both");
  const [editedPlusOneAllowed, setEditedPlusOneAllowed] = useState(
    Boolean(guest.plusOneAllowed),
  );
  const [editedNotes, setEditedNotes] = useState(guest.notes || "");

  const currentStatus = statusConfig[guest.status] || statusConfig.pending;
  const isValidName = editedName.trim().length >= 3;

  const handleSave = async () => {
    if (!isValidName) return;

    await onUpdateGuestName(guest, {
      name: editedName.trim(),
      side: editedSide,
      plusOneAllowed: editedPlusOneAllowed,
      notes: editedNotes.trim() || null,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(guest.name);
    setEditedSide(guest.side || "both");
    setEditedPlusOneAllowed(Boolean(guest.plusOneAllowed));
    setEditedNotes(guest.notes || "");
    setIsEditing(false);
  };

  return (
    <article className="wos-card p-5 rounded-3xl shadow-sm border border-black/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="h-12 w-12 shrink-0 rounded-2xl wos-guest-avatar flex items-center justify-center font-semibold">
            {guest.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="wos-input"
                />

                {!isValidName && (
                  <p className="text-xs text-red-500">
                    {t("guests.nameMinError")}
                  </p>
                )}

                <select
                  value={editedSide}
                  onChange={(e) => setEditedSide(e.target.value)}
                  className="wos-input text-sm"
                >
                  <option value="both">{sideConfig.both.label}</option>
                  <option value="bride">{sideConfig.bride.label}</option>
                  <option value="groom">{sideConfig.groom.label}</option>
                </select>

                <label className="flex items-center justify-between gap-4 rounded-2xl border border-[#eadde2] px-4 py-3 cursor-pointer hover:bg-[#fff8fa] transition">
                  <span className="text-sm font-medium wos-text-heading">
                    {t("guests.plusOne")}
                  </span>

                  <input
                    type="checkbox"
                    checked={editedPlusOneAllowed}
                    onChange={(e) => setEditedPlusOneAllowed(e.target.checked)}
                    className="h-5 w-5 accent-[#660033]"
                  />
                </label>

                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  maxLength={300}
                  rows={3}
                  placeholder={t("common.notesPlaceholder")}
                  className="wos-input resize-none text-sm"
                />
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold wos-text-heading truncate">
                  {guest.name}
                </h2>

                <p className="text-sm wos-text-muted mt-1">
                  {currentStatus.message}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      sideConfig[guest.side]?.className ||
                      sideConfig.both.className
                    }`}
                  >
                    {sideConfig[guest.side]?.label || sideConfig.both.label}
                  </span>

                  {guest.plusOneAllowed && (
                    <span className="text-xs font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      {t("guests.plusOne")}
                    </span>
                  )}
                </div>

                {guest.notes && (
                  <p className="text-sm wos-text-muted mt-3 bg-[#fff8fa] rounded-2xl px-4 py-3">
                    {guest.notes}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="wos-action-row">
          <span
            className={`w-fit text-sm font-medium px-3 py-1 rounded-full transition ${currentStatus.className}`}
          >
            {currentStatus.label}
          </span>

          <select
            value={guest.status}
            onChange={(e) => onChangeStatus(guest, e.target.value)}
            className="text-sm font-medium wos-text-heading border border-[#eadde2] px-4 py-2 rounded-2xl wos-card hover:bg-[#fff8fa] transition outline-none"
          >
            <option value="pending">{statusConfig.pending.label}</option>
            <option value="confirmed">{statusConfig.confirmed.label}</option>
            <option value="maybe">{statusConfig.maybe.label}</option>
            <option value="declined">{statusConfig.declined.label}</option>
          </select>

          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isValidName}
                className="text-sm font-medium text-white bg-[#660033] px-4 py-2 rounded-2xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition"
              >
                {t("common.save")}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="wos-secondary-btn active:scale-95 transition"
              >
                {t("common.cancel")}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="wos-secondary-btn hover:border-[#eadde2] active:scale-95 transition"
            >
              {t("common.edit")}
            </button>
          )}

          <button
            type="button"
            onClick={() => onDeleteGuest(guest)}
            className="text-sm font-medium text-red-600 border border-red-100 px-4 py-2 rounded-2xl hover:bg-red-50 hover:border-red-200 active:scale-95 transition"
          >
            {t("common.delete")}
          </button>
        </div>
      </div>
    </article>
  );
}

export default GuestCard;
