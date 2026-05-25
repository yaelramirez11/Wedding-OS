const prisma = require("../lib/prisma");

const TABLE_CAPACITY = 10;

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
  return prisma.weddingTable.create({
    data: {
      ...data,
      capacity: TABLE_CAPACITY,
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

  const count = await prisma.guest.count({
    where: {
      tableId,
    },
  });

  if (count >= TABLE_CAPACITY) {
    throw new Error("This table already has 10 guests.");
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
