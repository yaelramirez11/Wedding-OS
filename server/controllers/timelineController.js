const {
  getTimelineItems,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
} = require("../services/timelineService");

const { timelineItemSchema } = require("../validators/timelineValidator");
const { normalizeDateOnly } = require("../lib/dateOnly");

const normalizeDate = (date) => normalizeDateOnly(date);

const getTimeline = async (req, res, next) => {
  try {
    const items = await getTimelineItems(req.user.userId);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const createTimeline = async (req, res, next) => {
  try {
    const data = timelineItemSchema.parse(req.body);
    const item = await createTimelineItem(req.user.userId, {
      ...data,
      date: normalizeDate(data.date),
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateTimeline = async (req, res, next) => {
  try {
    const data = timelineItemSchema.partial().parse(req.body);
    const item = await updateTimelineItem(req.user.userId, req.params.id, {
      ...data,
      date: data.date === undefined ? undefined : normalizeDate(data.date),
    });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const deleteTimeline = async (req, res, next) => {
  try {
    const item = await deleteTimelineItem(req.user.userId, req.params.id);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTimeline,
  createTimeline,
  updateTimeline,
  deleteTimeline,
};
