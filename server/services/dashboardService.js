const prisma = require("../lib/prisma");
const { updateOwned } = require("../lib/ownership");

const getDashboardCards = (userId) => {
  return prisma.dashboardCard.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });
};

const createDashboardCard = (userId, data) => {
  return prisma.dashboardCard.create({
    data: {
      ...data,
      userId,
    },
  });
};

const updateDashboardCard = (userId, id, data) => {
  return updateOwned(prisma.dashboardCard, userId, id, data);
};

const getDashboardTasks = (userId) => {
  return prisma.dashboardTask.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });
};

const createDashboardTask = (userId, data) => {
  return prisma.dashboardTask.create({
    data: {
      ...data,
      userId,
    },
  });
};

const updateDashboardTask = (userId, id, data) => {
  return updateOwned(prisma.dashboardTask, userId, id, data);
};

module.exports = {
  getDashboardCards,
  createDashboardCard,
  updateDashboardCard,
  getDashboardTasks,
  createDashboardTask,
  updateDashboardTask,
};
