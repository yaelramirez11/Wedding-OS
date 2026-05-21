const prisma = require("../lib/prisma");

const getHoneymoonItems = () => {
  return prisma.honeymoonItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createHoneymoonItem = (data) => {
  return prisma.honeymoonItem.create({
    data,
  });
};

const updateHoneymoonItem = (id, data) => {
  return prisma.honeymoonItem.update({
    where: {
      id: Number(id),
    },
    data,
  });
};

const deleteHoneymoonItem = (id) => {
  return prisma.honeymoonItem.delete({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  getHoneymoonItems,
  createHoneymoonItem,
  updateHoneymoonItem,
  deleteHoneymoonItem,
};
