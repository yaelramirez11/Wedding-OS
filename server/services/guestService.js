const prisma = require("../lib/prisma");
const { deleteOwned, updateOwned } = require("../lib/ownership");

const getAllGuests = async (userId) => {
  return prisma.guest.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createGuest = async (userId, guestData) => {
  return prisma.guest.create({
    data: {
      ...guestData,
      userId,
    },
  });
};

const updateGuest = async (userId, id, guestData) => {
  const data = { ...guestData };

  if (data.status === "declined") {
    data.tableId = null;
    data.seatIndex = null;
  }

  return updateOwned(prisma.guest, userId, id, data);
};

const deleteGuest = async (userId, id) => {
  return deleteOwned(prisma.guest, userId, id);
};

module.exports = {
  getAllGuests,
  createGuest,
  updateGuest,
  deleteGuest,
};
