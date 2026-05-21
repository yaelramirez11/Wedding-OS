const prisma = require("../lib/prisma");

const getDashboardCards = () => {
  return prisma.dashboardCard.findMany({
    orderBy: { order: "asc" },
  });
};

const createDashboardCard = (data) => {
  return prisma.dashboardCard.create({ data });
};

const updateDashboardCard = (id, data) => {
  return prisma.dashboardCard.update({
    where: { id: Number(id) },
    data,
  });
};

const getDashboardTasks = () => {
  return prisma.dashboardTask.findMany({
    orderBy: { order: "asc" },
  });
};

const createDashboardTask = (data) => {
  return prisma.dashboardTask.create({ data });
};

const updateDashboardTask = (id, data) => {
  return prisma.dashboardTask.update({
    where: { id: Number(id) },
    data,
  });
};

module.exports = {
  getDashboardCards,
  createDashboardCard,
  updateDashboardCard,
  getDashboardTasks,
  createDashboardTask,
  updateDashboardTask,
};
