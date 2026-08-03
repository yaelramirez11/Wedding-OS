import {
  buildSeatSlots,
  buildSeatLayout,
  isLargeBanquetLayout,
  SWEETHEART_SEAT_LAYOUT,
} from "./tableSeatingUtils.js";

function BanquetTableSeating({
  table,
  guests,
  capacity,
  isSweetheart = false,
  variant = "light",
  prefersTapLayout,
  selectedGuestId,
  isAssigningSeat = false,
  statusConfig,
  emptyLabel,
  onDragStart,
  onOccupiedSeatClick,
  onSeatDrop,
  onEmptySeatClick,
  dualHeadLayout = false,
  createSeatTapHandler,
}) {
  const slots = buildSeatSlots(guests, capacity);
  const isDark = variant === "dark";
  const layout = isSweetheart
    ? SWEETHEART_SEAT_LAYOUT
    : buildSeatLayout(capacity, isSweetheart, dualHeadLayout);
  const isLargeLayout = isLargeBanquetLayout(capacity, isSweetheart);
  const tapDisabled = prefersTapLayout && isAssigningSeat;

  const renderSeat = (seatIndex, position) => {
    const guest = slots[seatIndex];
    const isSelected = guest && guest.id === selectedGuestId;

    const dragProps =
      guest && !prefersTapLayout
        ? {
            draggable: true,
            onDragStart: (event) => {
              event.stopPropagation();
              onDragStart(guest);
            },
          }
        : {};

    const dropProps = prefersTapLayout
      ? {}
      : {
          onDragOver: (event) => event.preventDefault(),
          onDrop: (event) => {
            event.preventDefault();
            event.stopPropagation();
            onSeatDrop(table, seatIndex);
          },
        };

    const statusLabel = guest
      ? statusConfig[guest.status]?.label || statusConfig.pending.label
      : null;

    if (!guest) {
      const canAssign = prefersTapLayout && selectedGuestId && !tapDisabled;

      return (
        <button
          key={`empty-${seatIndex}`}
          type="button"
          disabled={!canAssign}
          onPointerUp={
            canAssign && createSeatTapHandler
              ? createSeatTapHandler(() => onEmptySeatClick(table, seatIndex))
              : undefined
          }
          onClick={
            canAssign && !createSeatTapHandler
              ? () => onEmptySeatClick(table, seatIndex)
              : undefined
          }
          {...dropProps}
          className={`wos-banquet-seat wos-banquet-seat-empty wos-banquet-seat-${position} ${
            isDark ? "wos-banquet-seat-empty-dark" : ""
          } ${canAssign ? "wos-banquet-seat-target" : ""}`}
        >
          {emptyLabel}
        </button>
      );
    }

    const badgeClass =
      {
        confirmed: "bg-emerald-500",
        pending: "bg-[#e28a18]",
        maybe: "bg-[#8258ff]",
        declined: "bg-red-500",
      }[guest.status] || "bg-[#8d7380]";

    const canReceiveGuest =
      prefersTapLayout &&
      selectedGuestId &&
      guest.id !== selectedGuestId &&
      !tapDisabled;

    const occupiedTapHandler =
      prefersTapLayout && createSeatTapHandler
        ? createSeatTapHandler(() => onOccupiedSeatClick(table, seatIndex, guest))
        : undefined;

    return (
      <div
        key={guest.id}
        className={`wos-banquet-seat-wrap wos-banquet-seat-${position} ${
          isSelected ? "wos-banquet-seat-selected" : ""
        } ${canReceiveGuest ? "wos-banquet-seat-swap-target" : ""} ${
          tapDisabled ? "wos-banquet-seat-pending" : ""
        }`}
        {...dropProps}
      >
        <span
          className={`wos-banquet-seat-badge ${badgeClass}`}
          style={
            isDark ? { boxShadow: "0 0 0 2px #660033" } : undefined
          }
          title={statusLabel}
          aria-label={statusLabel}
        />

        {prefersTapLayout ? (
          <button
            type="button"
            disabled={tapDisabled}
            onPointerUp={occupiedTapHandler}
            className={`wos-banquet-seat wos-banquet-seat-tap ${
              isDark ? "wos-banquet-seat-dark" : "wos-banquet-seat-light"
            }`}
          >
            <span className="wos-banquet-seat-name">{guest.name}</span>
          </button>
        ) : (
          <div
            {...dragProps}
            className={`wos-banquet-seat wos-banquet-seat-drag ${
              isDark ? "wos-banquet-seat-dark" : "wos-banquet-seat-light"
            }`}
          >
            <span className="wos-banquet-seat-name">{guest.name}</span>
          </div>
        )}
      </div>
    );
  };

  if (isSweetheart) {
    return (
      <div className="wos-banquet-layout wos-banquet-layout-sweetheart">
        <div className="wos-banquet-body wos-banquet-body-sweetheart">
          {renderSeat(0, "left")}
          <div
            className={`wos-banquet-surface wos-banquet-surface-sweetheart ${
              isDark ? "wos-banquet-surface-dark" : ""
            }`}
            aria-hidden="true"
          />
          {renderSeat(1, "right")}
        </div>
      </div>
    );
  }

  const headSeats = layout.filter((seat) => seat.key.startsWith("head"));
  const footSeats = layout.filter((seat) => seat.key.startsWith("foot"));
  const leftSeats = layout.filter((seat) => seat.key.startsWith("left-"));
  const rightSeats = layout.filter((seat) => seat.key.startsWith("right-"));

  return (
    <div
      className={`wos-banquet-layout ${
        isLargeLayout ? "wos-banquet-layout-large" : ""
      } ${dualHeadLayout ? "wos-banquet-layout-dual-head" : ""}`}
    >
      {headSeats.length > 0 && (
        <div
          className={`wos-banquet-head ${
            headSeats.length > 1 ? "wos-banquet-head-dual" : ""
          }`}
        >
          {headSeats.map((seat) => renderSeat(seat.index, seat.key))}
        </div>
      )}

      <div className="wos-banquet-body">
        <div className="wos-banquet-side">
          {leftSeats.map((seat) => renderSeat(seat.index, seat.key))}
        </div>

        <div
          className={`wos-banquet-surface ${
            isDark ? "wos-banquet-surface-dark" : ""
          }`}
          aria-hidden="true"
        />

        <div className="wos-banquet-side">
          {rightSeats.map((seat) => renderSeat(seat.index, seat.key))}
        </div>
      </div>

      {footSeats.length > 0 && (
        <div
          className={`wos-banquet-foot ${
            footSeats.length > 1 ? "wos-banquet-foot-dual" : ""
          }`}
        >
          {footSeats.map((seat) => renderSeat(seat.index, seat.key))}
        </div>
      )}
    </div>
  );
}

export default BanquetTableSeating;
