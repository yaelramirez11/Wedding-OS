const prisma = require("../lib/prisma");
const { createError, notFoundError } = require("../lib/errors");
const { deleteOwned, updateOwned } = require("../lib/ownership");

const TABLE_CAPACITY = 10;
const SWEETHEART_TABLE_CAPACITY = 2;

const getCapacityForTable = (table) => {
  return table.name === "Sweetheart Table"
    ? SWEETHEART_TABLE_CAPACITY
    : TABLE_CAPACITY;
};

const getTables = async (userId) => {
  return prisma.weddingTable.findMany({
    where: { userId },
    include: {
      guests: {
        where: { userId },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });
};

const createTable = async (userId, data) => {
  const capacity =
    data.name === "Sweetheart Table"
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

  if (table.name === "Sweetheart Table") {
    throw createError("The sweetheart table cannot be removed.", 400);
  }

  await prisma.guest.updateMany({
    where: {
      tableId: Number(id),
      userId,
    },
    data: {
      tableId: null,
    },
  });

  return prisma.weddingTable.delete({
    where: {
      id: Number(id),
    },
  });
};

const assignGuestToTable = async (userId, { guestId, tableId }) => {
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

  const count = await prisma.guest.count({
    where: {
      tableId,
      userId,
    },
  });

  if (count >= capacity) {
    throw createError(`This table already has ${capacity} guests.`, 400);
  }

  return prisma.guest.update({
    where: {
      id: guestId,
    },
    data: {
      tableId,
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
