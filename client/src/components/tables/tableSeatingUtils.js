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

export const SWEETHEART_TABLE_NAME = "Sweetheart Table";
export const DEFAULT_TABLE_CAPACITY = 10;

export function getTableCapacity(table) {
  if (!table) return DEFAULT_TABLE_CAPACITY;

  if (table.name === SWEETHEART_TABLE_NAME) {
    return 2;
  }

  return table.capacity || DEFAULT_TABLE_CAPACITY;
}

export function buildSeatLayout(capacity, isSweetheart = false) {
  if (isSweetheart) {
    return SWEETHEART_SEAT_LAYOUT;
  }

  if (capacity === 10) {
    return REGULAR_SEAT_LAYOUT;
  }

  const layout = [{ index: 0, key: "head" }];
  const sideTotal = Math.max(capacity - 2, 0);
  const leftCount = Math.floor(sideTotal / 2);
  const rightCount = sideTotal - leftCount;

  for (let index = 0; index < leftCount; index += 1) {
    layout.push({ index: 1 + index, key: `left-${index}` });
  }

  for (let index = 0; index < rightCount; index += 1) {
    layout.push({ index: 1 + leftCount + index, key: `right-${index}` });
  }

  if (capacity > 1) {
    layout.push({ index: capacity - 1, key: "foot" });
  }

  return layout;
}

export function isLargeBanquetLayout(capacity, isSweetheart = false) {
  return !isSweetheart && capacity > 10;
}

export function isMergedTable(table) {
  if (!table || table.name === SWEETHEART_TABLE_NAME) {
    return false;
  }

  return Boolean(table.mergeMeta) || getTableCapacity(table) > DEFAULT_TABLE_CAPACITY;
}

export function getSeatPositionKey(seatIndex, capacity, isSweetheart = false) {
  const layout = buildSeatLayout(capacity, isSweetheart);
  return layout.find((seat) => seat.index === seatIndex)?.key || `seat-${seatIndex}`;
}

function findFirstOpenSeatIndex(occupiedSeatIndexes, capacity) {
  const occupied = new Set(
    occupiedSeatIndexes.filter((index) => index != null && index >= 0),
  );

  for (let index = 0; index < capacity; index += 1) {
    if (!occupied.has(index)) {
      return index;
    }
  }

  return null;
}

export function applyOptimisticSeatAssignment(
  tables,
  unseatedGuests,
  guestId,
  targetTableId,
  targetSeatIndex,
) {
  const targetTable = tables.find((table) => table.id === targetTableId);
  if (!targetTable) {
    return { tables, unseatedGuests };
  }

  const allGuests = [
    ...unseatedGuests.map((guest) => ({ ...guest, tableId: null })),
    ...tables.flatMap((table) =>
      table.guests.map((guest) => ({ ...guest, tableId: table.id })),
    ),
  ];

  const movingGuest = allGuests.find((guest) => guest.id === guestId);
  if (!movingGuest) {
    return { tables, unseatedGuests };
  }

  const capacity = getTableCapacity(targetTable);
  const targetGuests = allGuests.filter(
    (guest) => guest.tableId === targetTableId && guest.id !== guestId,
  );
  const occupant = targetGuests.find((guest) => guest.seatIndex === targetSeatIndex);
  const updatedById = new Map(allGuests.map((guest) => [guest.id, { ...guest }]));

  updatedById.set(guestId, {
    ...movingGuest,
    tableId: targetTableId,
    seatIndex: targetSeatIndex,
  });

  if (occupant) {
    const previousSeatIndex = movingGuest.seatIndex;
    const sameTable = movingGuest.tableId === targetTableId;

    if (
      sameTable &&
      previousSeatIndex != null &&
      previousSeatIndex >= 0 &&
      previousSeatIndex < capacity &&
      previousSeatIndex !== targetSeatIndex
    ) {
      updatedById.set(occupant.id, {
        ...occupant,
        tableId: targetTableId,
        seatIndex: previousSeatIndex,
      });
    } else {
      const fallbackSeat = findFirstOpenSeatIndex(
        targetGuests
          .filter((guest) => guest.id !== occupant.id)
          .map((guest) => guest.seatIndex)
          .concat(targetSeatIndex),
        capacity,
      );

      updatedById.set(occupant.id, {
        ...occupant,
        tableId: targetTableId,
        seatIndex: fallbackSeat,
      });
    }
  }

  const nextGuests = [...updatedById.values()];
  const nextUnseated = nextGuests.filter((guest) => !guest.tableId);
  const nextTables = tables.map((table) => ({
    ...table,
    guests: nextGuests.filter((guest) => guest.tableId === table.id),
  }));

  return {
    tables: nextTables,
    unseatedGuests: nextUnseated,
  };
}
