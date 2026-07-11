import { sortTableGuests } from "./tableSeatingUtils.js";

function buildSeatSlots(guests, capacity) {
  const sorted = sortTableGuests(guests);
  return Array.from({ length: capacity }, (_, index) => sorted[index] ?? null);
}

function BanquetTableSeating({
  guests,
  capacity,
  isSweetheart = false,
  variant = "light",
  isMobile,
  statusConfig,
  emptyLabel,
  onDragStart,
  onGuestClick,
}) {
  const slots = buildSeatSlots(guests, capacity);
  const isDark = variant === "dark";

  const renderSeat = (guest, position) => {
    const dragProps =
      guest && !isMobile
        ? {
            draggable: true,
            onDragStart: () => onDragStart(guest),
          }
        : {};

    const statusLabel = guest
      ? statusConfig[guest.status]?.label || statusConfig.pending.label
      : null;

    if (!guest) {
      return (
        <div
          key={`empty-${position}`}
          className={`wos-banquet-seat wos-banquet-seat-empty wos-banquet-seat-${position} ${
            isDark ? "wos-banquet-seat-empty-dark" : ""
          }`}
        >
          {emptyLabel}
        </div>
      );
    }

    const badgeClass =
      {
        confirmed: "bg-emerald-500",
        pending: "bg-[#e28a18]",
        maybe: "bg-[#8258ff]",
        declined: "bg-red-500",
      }[guest.status] || "bg-[#8d7380]";

    return (
      <div
        key={guest.id}
        className={`wos-banquet-seat-wrap wos-banquet-seat-${position}`}
      >
        <span
          className={`wos-banquet-seat-badge ${badgeClass}`}
          style={
            isDark
              ? { boxShadow: "0 0 0 2px #660033" }
              : undefined
          }
          title={statusLabel}
          aria-label={statusLabel}
        />

        <div
          {...dragProps}
          role={isMobile ? "button" : undefined}
          tabIndex={isMobile ? 0 : undefined}
          onClick={isMobile ? () => onGuestClick(guest) : undefined}
          onKeyDown={
            isMobile
              ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onGuestClick(guest);
                  }
                }
              : undefined
          }
          className={`wos-banquet-seat ${
            isDark ? "wos-banquet-seat-dark" : "wos-banquet-seat-light"
          } ${isMobile ? "wos-banquet-seat-tap" : "wos-banquet-seat-drag"}`}
        >
          <span className="wos-banquet-seat-name">{guest.name}</span>
        </div>
      </div>
    );
  };

  if (isSweetheart) {
    return (
      <div className="wos-banquet-layout wos-banquet-layout-sweetheart">
        <div className="wos-banquet-body wos-banquet-body-sweetheart">
          {renderSeat(slots[0], "left")}
          <div
            className={`wos-banquet-surface wos-banquet-surface-sweetheart ${
              isDark ? "wos-banquet-surface-dark" : ""
            }`}
            aria-hidden="true"
          />
          {renderSeat(slots[1], "right")}
        </div>
      </div>
    );
  }

  return (
    <div className="wos-banquet-layout">
      <div className="wos-banquet-head">{renderSeat(slots[0], "head")}</div>

      <div className="wos-banquet-body">
        <div className="wos-banquet-side">
          {slots.slice(1, 5).map((guest, index) =>
            renderSeat(guest, `left-${index}`),
          )}
        </div>

        <div
          className={`wos-banquet-surface ${isDark ? "wos-banquet-surface-dark" : ""}`}
          aria-hidden="true"
        />

        <div className="wos-banquet-side">
          {slots.slice(5, 9).map((guest, index) =>
            renderSeat(guest, `right-${index}`),
          )}
        </div>
      </div>

      <div className="wos-banquet-foot">{renderSeat(slots[9], "foot")}</div>
    </div>
  );
}

export default BanquetTableSeating;
