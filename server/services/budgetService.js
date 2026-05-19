const prisma = require("../lib/prisma");

const getBudgetItems = () => {
  return prisma.budgetItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createBudgetItem = (data) => {
  return prisma.budgetItem.create({
    data,
  });
};

const updateBudgetItem = (id, data) => {
  return prisma.budgetItem.update({
    where: {
      id: Number(id),
    },
    data,
  });
};

const deleteBudgetItem = (id) => {
  return prisma.budgetItem.delete({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  getBudgetItems,
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
};
