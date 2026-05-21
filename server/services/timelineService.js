const prisma = require("../lib/prisma");

const getTimelineItems = () => {
  return prisma.timelineItem.findMany({
    orderBy: [
      {
        date: "asc",
      },
      {
        order: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
};

const createTimelineItem = (data) => {
  return prisma.timelineItem.create({
    data,
  });
};

const updateTimelineItem = (id, data) => {
  return prisma.timelineItem.update({
    where: {
      id: Number(id),
    },
    data,
  });
};

const deleteTimelineItem = (id) => {
  return prisma.timelineItem.delete({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  getTimelineItems,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
};
