const prisma = require("../lib/prisma");

const getAllGuests = async () => {
  return prisma.guest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createGuest = async (guestData) => {
  return prisma.guest.create({
    data: guestData,
  });
};

const updateGuest = async (id, guestData) => {
  return prisma.guest.update({
    where: {
      id: Number(id),
    },
    data: guestData,
  });
};

const deleteGuest = async (id) => {
  return prisma.guest.delete({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  getAllGuests,
  createGuest,
  updateGuest,
  deleteGuest,
};
