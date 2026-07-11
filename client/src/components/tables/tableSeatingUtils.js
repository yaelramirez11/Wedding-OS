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
