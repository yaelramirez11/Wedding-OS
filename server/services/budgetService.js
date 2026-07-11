const prisma = require("../lib/prisma");
const { deleteOwned, updateOwned } = require("../lib/ownership");

const getBudgetItems = (userId) => {
  return prisma.budgetItem.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createBudgetItem = (userId, data) => {
  return prisma.budgetItem.create({
    data: {
      ...data,
      userId,
    },
  });
};

const updateBudgetItem = (userId, id, data) => {
  return updateOwned(prisma.budgetItem, userId, id, data);
};

const deleteBudgetItem = (userId, id) => {
  return deleteOwned(prisma.budgetItem, userId, id);
};

module.exports = {
  getBudgetItems,
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
};
