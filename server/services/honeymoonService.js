const prisma = require("../lib/prisma");
const { deleteOwned, updateOwned } = require("../lib/ownership");

const getHoneymoonItems = (userId) => {
  return prisma.honeymoonItem.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createHoneymoonItem = (userId, data) => {
  return prisma.honeymoonItem.create({
    data: {
      ...data,
      userId,
    },
  });
};

const updateHoneymoonItem = (userId, id, data) => {
  return updateOwned(prisma.honeymoonItem, userId, id, data);
};

const deleteHoneymoonItem = (userId, id) => {
  return deleteOwned(prisma.honeymoonItem, userId, id);
};

module.exports = {
  getHoneymoonItems,
  createHoneymoonItem,
  updateHoneymoonItem,
  deleteHoneymoonItem,
};
