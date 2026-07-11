const prisma = require("../lib/prisma");
const { deleteOwned, updateOwned } = require("../lib/ownership");
const { sortTimelineItems } = require("../lib/timelineSort");

const recalculateTimelineOrders = async (userId) => {
  const items = await prisma.timelineItem.findMany({
    where: { userId },
  });

  const sortedItems = sortTimelineItems(items);

  await prisma.$transaction(
    sortedItems.map((item, index) =>
      prisma.timelineItem.update({
        where: { id: item.id },
        data: { order: index + 1 },
      }),
    ),
  );
};

const getTimelineItems = (userId) => {
  return prisma.timelineItem.findMany({
    where: { userId },
    orderBy: [
      {
        date: "asc",
      },
      {
        order: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
};

const createTimelineItem = async (userId, data) => {
  const created = await prisma.timelineItem.create({
    data: {
      ...data,
      userId,
    },
  });

  await recalculateTimelineOrders(userId);

  return prisma.timelineItem.findFirst({
    where: {
      id: created.id,
      userId,
    },
  });
};

const updateTimelineItem = async (userId, id, data) => {
  await updateOwned(prisma.timelineItem, userId, id, data);
  await recalculateTimelineOrders(userId);

  return prisma.timelineItem.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });
};

const deleteTimelineItem = async (userId, id) => {
  const deleted = await deleteOwned(prisma.timelineItem, userId, id);
  await recalculateTimelineOrders(userId);
  return deleted;
};

module.exports = {
  getTimelineItems,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
};
