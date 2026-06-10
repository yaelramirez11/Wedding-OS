const prisma = require("../lib/prisma");

const TABLE_CAPACITY = 10;
const SWEETHEART_TABLE_CAPACITY = 2;

const getCapacityForTable = (table) => {
  return table.name === "Sweetheart Table"
    ? SWEETHEART_TABLE_CAPACITY
    : TABLE_CAPACITY;
};

const getTables = async () => {
  return prisma.weddingTable.findMany({
    include: {
      guests: {
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

const createTable = async (data) => {
  const capacity =
    data.name === "Sweetheart Table"
      ? SWEETHEART_TABLE_CAPACITY
      : TABLE_CAPACITY;

  return prisma.weddingTable.create({
    data: {
      ...data,
      capacity,
    },
  });
};

const updateTable = async (id, data) => {
  return prisma.weddingTable.update({
    where: {
      id: Number(id),
    },
    data,
  });
};

const deleteTable = async (id) => {
  await prisma.guest.updateMany({
    where: {
      tableId: Number(id),
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

const assignGuestToTable = async ({ guestId, tableId }) => {
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

  const table = await prisma.weddingTable.findUnique({
    where: {
      id: tableId,
    },
  });

  if (!table) {
    throw new Error("Table not found.");
  }

  const capacity = getCapacityForTable(table);

  const count = await prisma.guest.count({
    where: {
      tableId,
    },
  });

  if (count >= capacity) {
    throw new Error(`This table already has ${capacity} guests.`);
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

const getUnseatedGuests = async () => {
  return prisma.guest.findMany({
    where: {
      tableId: null,
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
