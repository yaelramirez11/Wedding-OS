const prisma = require("../lib/prisma");

const claimOrphanData = async (userId) => {
  await prisma.$transaction([
    prisma.guest.updateMany({
      where: { userId: null },
      data: { userId },
    }),
    prisma.budgetItem.updateMany({
      where: { userId: null },
      data: { userId },
    }),
    prisma.honeymoonItem.updateMany({
      where: { userId: null },
      data: { userId },
    }),
    prisma.timelineItem.updateMany({
      where: { userId: null },
      data: { userId },
    }),
    prisma.dashboardCard.updateMany({
      where: { userId: null },
      data: { userId },
    }),
    prisma.dashboardTask.updateMany({
      where: { userId: null },
      data: { userId },
    }),
    prisma.weddingTable.updateMany({
      where: { userId: null },
      data: { userId },
    }),
  ]);
};

module.exports = {
  claimOrphanData,
};
