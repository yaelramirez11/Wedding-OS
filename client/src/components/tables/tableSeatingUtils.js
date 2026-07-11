const TABLE_GUEST_STATUS_ORDER = {
  confirmed: 0,
  pending: 1,
  maybe: 2,
  declined: 3,
};

export function sortTableGuests(guests) {
  return [...guests].sort((a, b) => {
    const orderA = TABLE_GUEST_STATUS_ORDER[a.status] ?? 99;
    const orderB = TABLE_GUEST_STATUS_ORDER[b.status] ?? 99;

    if (orderA !== orderB) return orderA - orderB;

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

export function buildSeatSlots(guests, capacity) {
  const slots = Array.from({ length: capacity }, () => null);
  const unassigned = [];

  for (const guest of guests) {
    if (
      guest.seatIndex != null &&
      guest.seatIndex >= 0 &&
      guest.seatIndex < capacity &&
      !slots[guest.seatIndex]
    ) {
      slots[guest.seatIndex] = guest;
    } else {
      unassigned.push(guest);
    }
  }

  const sortedUnassigned = sortTableGuests(unassigned);
  let nextGuest = 0;

  for (let index = 0; index < capacity && nextGuest < sortedUnassigned.length; index += 1) {
    if (!slots[index]) {
      slots[index] = sortedUnassigned[nextGuest];
      nextGuest += 1;
    }
  }

  return slots;
}

export const REGULAR_SEAT_LAYOUT = [
  { index: 0, key: "head" },
  { index: 1, key: "left-0" },
  { index: 2, key: "left-1" },
  { index: 3, key: "left-2" },
  { index: 4, key: "left-3" },
  { index: 5, key: "right-0" },
  { index: 6, key: "right-1" },
  { index: 7, key: "right-2" },
  { index: 8, key: "right-3" },
  { index: 9, key: "foot" },
];

export const SWEETHEART_SEAT_LAYOUT = [
  { index: 0, key: "left" },
  { index: 1, key: "right" },
];
