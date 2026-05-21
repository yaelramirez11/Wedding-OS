const {
  getTimelineItems,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
} = require("../services/timelineService");

const { timelineItemSchema } = require("../validators/timelineValidator");

const normalizeDate = (date) => {
  if (!date) return null;

  return new Date(date);
};

const getTimeline = async (req, res) => {
  try {
    const items = await getTimelineItems();

    res.json(items);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch timeline items",
    });
  }
};

const createTimeline = async (req, res) => {
  try {
    const data = timelineItemSchema.parse(req.body);

    const item = await createTimelineItem({
      ...data,
      date: normalizeDate(data.date),
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({
      error: error.errors?.[0]?.message || error.message,
    });
  }
};

const updateTimeline = async (req, res) => {
  try {
    const data = timelineItemSchema.partial().parse(req.body);

    const item = await updateTimelineItem(req.params.id, {
      ...data,
      date: data.date === undefined ? undefined : normalizeDate(data.date),
    });

    res.json(item);
  } catch (error) {
    res.status(400).json({
      error: error.errors?.[0]?.message || error.message,
    });
  }
};

const deleteTimeline = async (req, res) => {
  try {
    const item = await deleteTimelineItem(req.params.id);

    res.json(item);
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete timeline item",
    });
  }
};

module.exports = {
  getTimeline,
  createTimeline,
  updateTimeline,
  deleteTimeline,
};
