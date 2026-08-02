const prisma = require("../lib/prisma");
const { createError, notFoundError } = require("../lib/errors");
const { updateOwned } = require("../lib/ownership");

const TABLE_CAPACITY = 10;
const SWEETHEART_TABLE_CAPACITY = 2;
const SWEETHEART_TABLE_NAME = "Sweetheart Table";
const DEFAULT_MERGED_TABLE_NAMES = new Set([
  "Merged table",
  "Mesa unida",
]);

const getCapacityForTable = (table) => {
  if (table.name === SWEETHEART_TABLE_NAME) {
    return SWEETHEART_TABLE_CAPACITY;
  }

  return table.capacity || TABLE_CAPACITY;
};

const isMergedCapacity = (table) =>
  table.name !== SWEETHEART_TABLE_NAME && getCapacityForTable(table) > TABLE_CAPACITY;

const isMergedTable = (table) => Boolean(table.mergeMeta) || isMergedCapacity(table);

const getNextTableNumbers = (tables, count = 2) => {
  const usedNumbers = new Set(
    tables
      .map((item) => /^Table (\d+)$/.exec(item.name)?.[1])
      .filter(Boolean)
      .map(Number),
  );

  const available = [];

  for (let number = 1; available.length < count && number < 100; number += 1) {
    if (!usedNumbers.has(number)) {
      available.push(number);
    }
  }

  while (available.length < count) {
    available.push(available.length + 1);
  }

  return available;
};

const inferLegacyMergeMeta = async (userId, table) => {
  if (!isMergedCapacity(table)) {
    return null;
  }

  const allTables = await prisma.weddingTable.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      order: true,
    },
  });

  const primaryCapacity = TABLE_CAPACITY;
  const secondaryCapacity = getCapacityForTable(table) - primaryCapacity;
  const [firstNumber, secondNumber] = getNextTableNumbers(
    allTables.filter((item) => item.id !== table.id),
    2,
  );

  let primaryName = table.name;
  let partnerName = `Table ${secondNumber}`;

  if (DEFAULT_MERGED_TABLE_NAMES.has(table.name) || !/^Table \d+$/.test(table.name)) {
    primaryName = `Table ${firstNumber}`;
    partnerName = `Table ${secondNumber}`;
  }

  return {
    primaryName,
    partnerName,
    partnerLabel: table.label,
    partnerOrder: table.order + 1,
    primaryCapacity,
    secondaryCapacity,
    addExtraSeat: getCapacityForTable(table) === primaryCapacity + secondaryCapacity + 1,
    inferred: true,
  };
};

const resolveMergeMeta = async (userId, table) => {
  if (table.mergeMeta) {
    return table.mergeMeta;
  }

  return inferLegacyMergeMeta(userId, table);
};

const splitGuestsForUnmerge = (guests, primaryCapacity, hasStoredMeta) => {
  const primaryGuests = [];
  const secondaryGuests = [];

  const usesSeatBoundary = guests.every(
    (guest) =>
      guest.seatIndex == null ||
      guest.seatIndex < primaryCapacity ||
      guest.seatIndex >= primaryCapacity,
  );

  if (hasStoredMeta || usesSeatBoundary) {
    for (const guest of guests) {
      if (guest.seatIndex != null && guest.seatIndex >= primaryCapacity) {
        secondaryGuests.push(guest);
      } else {
        primaryGuests.push(guest);
      }
    }

    return { primaryGuests, secondaryGuests };
  }

  const sortedGuests = [...guests].sort((a, b) => {
    const seatA = a.seatIndex == null ? Number.MAX_SAFE_INTEGER : a.seatIndex;
    const seatB = b.seatIndex == null ? Number.MAX_SAFE_INTEGER : b.seatIndex;

    if (seatA !== seatB) return seatA - seatB;

    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return {
    primaryGuests: sortedGuests.slice(0, primaryCapacity),
    secondaryGuests: sortedGuests.slice(primaryCapacity),
  };
};

const getTables = async (userId) => {
  return prisma.weddingTable.findMany({
    where: { userId },
    include: {
      guests: {
        where: { userId },
        orderBy: [{ seatIndex: "asc" }, { createdAt: "asc" }],
      },
    },
    orderBy: {
      order: "asc",
    },
  });
};

const createTable = async (userId, data) => {
  const capacity =
    data.name === SWEETHEART_TABLE_NAME
      ? SWEETHEART_TABLE_CAPACITY
      : data.capacity || TABLE_CAPACITY;

  return prisma.weddingTable.create({
    data: {
      name: data.name,
      label: data.label ?? null,
      order: data.order ?? 0,
      capacity,
      userId,
    },
  });
};

const updateTable = async (userId, id, data) => {
  const table = await prisma.weddingTable.findFirst({
    where: {
      id: Number(id),
      userId,
    },
    include: {
      guests: {
        where: { userId },
      },
    },
  });

  if (!table) {
    throw notFoundError();
  }

  const isSweetheart = table.name === SWEETHEART_TABLE_NAME;
  const payload = {};

  if (data.name != null && !isSweetheart) {
    payload.name = data.name;
  }

  if (data.label !== undefined) {
    payload.label = data.label;
  }

  if (data.order != null) {
    payload.order = data.order;
  }

  if (data.capacity != null && !isSweetheart) {
    if (data.capacity < table.guests.length) {
      throw createError(
        `Capacity cannot be lower than the ${table.guests.length} seated guests.`,
        400,
      );
    }

    payload.capacity = data.capacity;
  }

  if (data.name != null && isMergedTable(table)) {
    throw createError(
      "Rename the table after splitting the merged tables.",
      400,
    );
  }

  if (data.capacity != null && isMergedTable(table)) {
    throw createError(
      "Change capacity after splitting the merged tables.",
      400,
    );
  }

  return updateOwned(prisma.weddingTable, userId, id, payload);
};

const mergeTables = async (
  userId,
  { primaryTableId, secondaryTableId, name, label, order, addExtraSeat },
) => {
  if (primaryTableId === secondaryTableId) {
    throw createError("Choose two different tables to merge.", 400);
  }

  const [primary, secondary] = await Promise.all([
    prisma.weddingTable.findFirst({
      where: { id: primaryTableId, userId },
      include: {
        guests: {
          where: { userId },
          orderBy: [{ seatIndex: "asc" }, { createdAt: "asc" }],
        },
      },
    }),
    prisma.weddingTable.findFirst({
      where: { id: secondaryTableId, userId },
      include: {
        guests: {
          where: { userId },
          orderBy: [{ seatIndex: "asc" }, { createdAt: "asc" }],
        },
      },
    }),
  ]);

  if (!primary || !secondary) {
    throw notFoundError("One or both tables were not found.");
  }

  if (
    primary.name === SWEETHEART_TABLE_NAME ||
    secondary.name === SWEETHEART_TABLE_NAME
  ) {
    throw createError("The sweetheart table cannot be merged.", 400);
  }

  if (isMergedTable(primary) || isMergedTable(secondary)) {
    throw createError("Split a merged table before merging again.", 400);
  }

  const primaryCapacity = getCapacityForTable(primary);
  const secondaryCapacity = getCapacityForTable(secondary);
  const baseCapacity = primaryCapacity + secondaryCapacity;
  const mergedCapacity = addExtraSeat ? baseCapacity + 1 : baseCapacity;
  const totalGuests = primary.guests.length + secondary.guests.length;

  if (totalGuests > mergedCapacity) {
    throw createError(
      `The merged table needs at least ${totalGuests} seats.`,
      400,
    );
  }

  const guestUpdates = [];
  let nextSecondarySeat = primaryCapacity;

  for (const guest of secondary.guests) {
    guestUpdates.push(
      prisma.guest.update({
        where: { id: guest.id },
        data: {
          tableId: primary.id,
          seatIndex: nextSecondarySeat,
        },
      }),
    );
    nextSecondarySeat += 1;
  }

  const mergeMeta = {
    primaryName: primary.name,
    partnerName: secondary.name,
    partnerLabel: secondary.label,
    partnerOrder: secondary.order,
    primaryCapacity,
    secondaryCapacity,
    addExtraSeat: Boolean(addExtraSeat),
  };

  await prisma.$transaction([
    ...guestUpdates,
    prisma.weddingTable.update({
      where: { id: primary.id },
      data: {
        name,
        label: label ?? null,
        order: order ?? primary.order,
        capacity: mergedCapacity,
        mergeMeta,
      },
    }),
    prisma.weddingTable.delete({
      where: { id: secondary.id },
    }),
  ]);

  return getTables(userId);
};

const unmergeTable = async (userId, tableId) => {
  const table = await prisma.weddingTable.findFirst({
    where: {
      id: Number(tableId),
      userId,
    },
    include: {
      guests: {
        where: { userId },
        orderBy: [{ seatIndex: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!table) {
    throw notFoundError();
  }

  const mergeMeta = await resolveMergeMeta(userId, table);

  if (!mergeMeta) {
    throw createError("This table is not a merged table.", 400);
  }

  const {
    primaryName,
    partnerName,
    partnerLabel,
    partnerOrder,
    primaryCapacity,
    secondaryCapacity,
  } = mergeMeta;

  const { primaryGuests, secondaryGuests } = splitGuestsForUnmerge(
    table.guests,
    primaryCapacity,
    Boolean(table.mergeMeta),
  );

  if (primaryGuests.length > primaryCapacity) {
    throw createError(
      "Too many guests are assigned to the first table section.",
      400,
    );
  }

  if (secondaryGuests.length > secondaryCapacity) {
    throw createError(
      "Too many guests are assigned to the second table section.",
      400,
    );
  }

  const recreatedSecondary = await prisma.weddingTable.create({
    data: {
      name: partnerName,
      label: partnerLabel ?? null,
      order: partnerOrder ?? table.order + 1,
      capacity: secondaryCapacity,
      userId,
    },
  });

  const guestUpdates = [
    ...primaryGuests.map((guest, index) =>
      prisma.guest.update({
        where: { id: guest.id },
        data: {
          tableId: table.id,
          seatIndex:
            guest.seatIndex != null && guest.seatIndex < primaryCapacity
              ? guest.seatIndex
              : index,
        },
      }),
    ),
    ...secondaryGuests.map((guest, index) =>
      prisma.guest.update({
        where: { id: guest.id },
        data: {
          tableId: recreatedSecondary.id,
          seatIndex:
            guest.seatIndex != null && guest.seatIndex >= primaryCapacity
              ? guest.seatIndex - primaryCapacity
              : index,
        },
      }),
    ),
    prisma.weddingTable.update({
      where: { id: table.id },
      data: {
        name: primaryName || table.name,
        capacity: primaryCapacity,
        mergeMeta: null,
      },
    }),
  ];

  await prisma.$transaction(guestUpdates);

  return getTables(userId);
};

const deleteTable = async (userId, id) => {
  const table = await prisma.weddingTable.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!table) {
    throw notFoundError();
  }

  if (table.name === SWEETHEART_TABLE_NAME) {
    throw createError("The sweetheart table cannot be removed.", 400);
  }

  await prisma.guest.updateMany({
    where: {
      tableId: Number(id),
      userId,
    },
    data: {
      tableId: null,
      seatIndex: null,
    },
  });

  return prisma.weddingTable.delete({
    where: {
      id: Number(id),
    },
  });
};

const findFirstOpenSeat = (occupiedSeatIndexes, capacity) => {
  const used = new Set(
    occupiedSeatIndexes.filter((index) => index != null && index >= 0),
  );

  for (let index = 0; index < capacity; index += 1) {
    if (!used.has(index)) return index;
  }

  return null;
};

const assignGuestToTable = async (userId, { guestId, tableId, seatIndex }) => {
  const guest = await prisma.guest.findFirst({
    where: {
      id: guestId,
      userId,
    },
  });

  if (!guest) {
    throw notFoundError("Guest not found.");
  }

  if (!tableId) {
    return prisma.guest.update({
      where: {
        id: guestId,
      },
      data: {
        tableId: null,
        seatIndex: null,
      },
    });
  }

  const table = await prisma.weddingTable.findFirst({
    where: {
      id: tableId,
      userId,
    },
  });

  if (!table) {
    throw createError("Table not found.", 404);
  }

  const capacity = getCapacityForTable(table);
  const tableGuests = await prisma.guest.findMany({
    where: {
      tableId,
      userId,
    },
    select: {
      id: true,
      seatIndex: true,
    },
  });

  const isAlreadyAtTable = guest.tableId === tableId;
  const otherGuests = tableGuests.filter((item) => item.id !== guestId);

  if (!isAlreadyAtTable && otherGuests.length >= capacity) {
    throw createError(`This table already has ${capacity} guests.`, 400);
  }

  let targetSeatIndex = seatIndex;

  if (targetSeatIndex != null) {
    if (targetSeatIndex < 0 || targetSeatIndex >= capacity) {
      throw createError("Invalid seat.", 400);
    }
  } else {
    targetSeatIndex = findFirstOpenSeat(
      otherGuests.map((item) => item.seatIndex),
      capacity,
    );

    if (targetSeatIndex == null) {
      throw createError(`This table already has ${capacity} guests.`, 400);
    }
  }

  const occupant = otherGuests.find(
    (item) => item.seatIndex === targetSeatIndex,
  );

  if (occupant) {
    const previousSeatIndex = guest.seatIndex;

    if (
      previousSeatIndex != null &&
      previousSeatIndex >= 0 &&
      previousSeatIndex < capacity &&
      previousSeatIndex !== targetSeatIndex
    ) {
      await prisma.$transaction([
        prisma.guest.update({
          where: { id: occupant.id },
          data: { seatIndex: previousSeatIndex },
        }),
        prisma.guest.update({
          where: { id: guestId },
          data: {
            tableId,
            seatIndex: targetSeatIndex,
          },
        }),
      ]);
    } else {
      const fallbackSeat = findFirstOpenSeat(
        otherGuests
          .filter((item) => item.id !== occupant.id)
          .map((item) => item.seatIndex),
        capacity,
      );

      await prisma.$transaction([
        prisma.guest.update({
          where: { id: occupant.id },
          data: { seatIndex: fallbackSeat },
        }),
        prisma.guest.update({
          where: { id: guestId },
          data: {
            tableId,
            seatIndex: targetSeatIndex,
          },
        }),
      ]);
    }

    return prisma.guest.findUnique({ where: { id: guestId } });
  }

  return prisma.guest.update({
    where: {
      id: guestId,
    },
    data: {
      tableId,
      seatIndex: targetSeatIndex,
    },
  });
};

const getUnseatedGuests = async (userId) => {
  return prisma.guest.findMany({
    where: {
      userId,
      tableId: null,
      status: { not: "declined" },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

module.exports = {
  getTables,
  createTable,
  updateTable,
  mergeTables,
  unmergeTable,
  deleteTable,
  assignGuestToTable,
  getUnseatedGuests,
  SWEETHEART_TABLE_NAME,
  isMergedTable,
};
