const prisma = require("../lib/prisma");
const { createError, notFoundError } = require("../lib/errors");
const { updateOwned } = require("../lib/ownership");

const TABLE_CAPACITY = 10;
const SWEETHEART_TABLE_CAPACITY = 2;
const SWEETHEART_TABLE_NAME = "Sweetheart Table";

const getCapacityForTable = (table) =>
  table.name === SWEETHEART_TABLE_NAME
    ? SWEETHEART_TABLE_CAPACITY
    : TABLE_CAPACITY;

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
      : TABLE_CAPACITY;

  return prisma.weddingTable.create({
    data: {
      ...data,
      capacity,
      userId,
    },
  });
};

const updateTable = async (userId, id, data) => {
  return updateOwned(prisma.weddingTable, userId, id, data);
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
  deleteTable,
  assignGuestToTable,
  getUnseatedGuests,
};
