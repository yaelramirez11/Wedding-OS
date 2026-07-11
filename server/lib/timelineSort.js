const { getDateOnlyMs } = require("./dateOnly");

const TYPE_RANK = {
  planning: 0,
  honeymoon: 1,
  weddingDay: 2,
};

const parseTimeToMinutes = (time) => {
  if (!time) return null;

  const [hours, minutes] = time.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
};

const getTimelineSortMeta = (item) => {
  const hasDate = Boolean(item.date);
  const dateMs = hasDate ? getDateOnlyMs(item.date) : null;

  return {
    hasDate,
    dateMs,
    timeMinutes: parseTimeToMinutes(item.time),
    typeOrder: TYPE_RANK[item.type] ?? 0,
    createdAt: item.createdAt ? new Date(item.createdAt).getTime() : 0,
    id: item.id ?? 0,
  };
};

const compareTimelineItems = (a, b) => {
  const metaA = getTimelineSortMeta(a);
  const metaB = getTimelineSortMeta(b);

  if (metaA.hasDate && metaB.hasDate) {
    if (metaA.dateMs !== metaB.dateMs) {
      return metaA.dateMs - metaB.dateMs;
    }

    const timeA = metaA.timeMinutes ?? Number.MAX_SAFE_INTEGER;
    const timeB = metaB.timeMinutes ?? Number.MAX_SAFE_INTEGER;

    if (timeA !== timeB) {
      return timeA - timeB;
    }

    return metaA.id - metaB.id;
  }

  if (metaA.hasDate) return -1;
  if (metaB.hasDate) return 1;

  if (a.type === "weddingDay" && b.type === "weddingDay") {
    const timeA = metaA.timeMinutes ?? Number.MAX_SAFE_INTEGER;
    const timeB = metaB.timeMinutes ?? Number.MAX_SAFE_INTEGER;

    if (timeA !== timeB) {
      return timeA - timeB;
    }
  } else if (metaA.typeOrder !== metaB.typeOrder) {
    return metaA.typeOrder - metaB.typeOrder;
  }

  const orderDiff = (a.order || 0) - (b.order || 0);

  if (orderDiff !== 0) {
    return orderDiff;
  }

  if (metaA.createdAt !== metaB.createdAt) {
    return metaA.createdAt - metaB.createdAt;
  }

  return metaA.id - metaB.id;
};

const sortTimelineItems = (items) => [...items].sort(compareTimelineItems);

module.exports = {
  compareTimelineItems,
  sortTimelineItems,
};
