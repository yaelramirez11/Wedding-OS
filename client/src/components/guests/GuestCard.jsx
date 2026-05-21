import { useState } from "react";

const statusConfig = {
  pending: {
    label: "Pending",
    message: "Waiting for confirmation ⏳",
    className: "bg-yellow-50 text-black-700",
  },
  confirmed: {
    label: "Confirmed",
    message: "I'm coming ❤️",
    className: "bg-green-50 text-green-700",
  },
  declined: {
    label: "Declined",
    message: "I can’t make it 😞",
    className: "bg-red-100 text-red-700",
  },
  maybe: {
    label: "Not Sure",
    message: "I'm not sure I'll make it 🤞",
    className: "bg-blue-50 text-black-700",
  },
};

const sideConfig = {
  bride: {
    label: "Bride side",
    className: "bg-rose-100 text-black-700",
  },
  groom: {
    label: "Groom side",
    className: "bg-blue-50 text-black-700",
  },
  both: {
    label: "Both sides",
    className: "bg-amber-50 text-black-700",
  },
};

function GuestCard({
  guest,
  onChangeStatus,
  onDeleteGuest,
  onUpdateGuestName,
}) {
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
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-[#F7F4EF] flex items-center justify-center font-semibold text-gray-800">
            {guest.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2 outline-none focus:border-black transition"
                />

                {!isValidName && (
                  <p className="text-xs text-red-500">
                    The name must have at least 3 characters, darling
                  </p>
                )}

                <select
                  value={editedSide}
                  onChange={(e) => setEditedSide(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2 outline-none focus:border-black transition wos-card text-sm"
                >
                  <option value="both">Both sides</option>
                  <option value="bride">Bride side</option>
                  <option value="groom">Groom side</option>
                </select>

                <label className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 px-4 py-3 cursor-pointer hover:bg-gray-50 transition">
                  <span className="text-sm font-medium">Plus one allowed</span>

                  <input
                    type="checkbox"
                    checked={editedPlusOneAllowed}
                    onChange={(e) => setEditedPlusOneAllowed(e.target.checked)}
                    className="h-5 w-5 accent-black"
                  />
                </label>

                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  maxLength={300}
                  rows={3}
                  placeholder="Notes, darling..."
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2 outline-none focus:border-black transition resize-none text-sm"
                />
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-950 truncate">
                  {guest.name}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {currentStatus.message}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      sideConfig[guest.side]?.className ||
                      sideConfig.both.className
                    }`}
                  >
                    {sideConfig[guest.side]?.label || "Both sides"}
                  </span>

                  {guest.plusOneAllowed && (
                    <span className="text-xs font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      Plus one allowed
                    </span>
                  )}
                </div>

                {guest.notes && (
                  <p className="text-sm text-gray-500 mt-3 bg-gray-50 rounded-2xl px-4 py-3">
                    {guest.notes}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
          <span
            className={`w-fit text-sm font-medium px-3 py-1 rounded-full transition ${currentStatus.className}`}
          >
            {currentStatus.label}
          </span>

          <select
            value={guest.status}
            onChange={(e) => onChangeStatus(guest, e.target.value)}
            className="text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-2xl wos-card hover:bg-gray-50 transition outline-none"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="maybe">Maybe</option>
            <option value="declined">Declined</option>
          </select>

          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isValidName}
                className="text-sm font-medium text-white bg-black px-4 py-2 rounded-2xl hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition"
              >
                Save
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-2xl hover:bg-gray-50 active:scale-95 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-2xl hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition"
            >
              Edit
            </button>
          )}

          <button
            type="button"
            onClick={() => onDeleteGuest(guest)}
            className="text-sm font-medium text-red-600 border border-red-100 px-4 py-2 rounded-2xl hover:bg-red-50 hover:border-red-200 active:scale-95 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default GuestCard;
