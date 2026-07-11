const {
  getHoneymoonItems,
  createHoneymoonItem,
  updateHoneymoonItem,
  deleteHoneymoonItem,
} = require("../services/honeymoonService");

const { honeymoonItemSchema } = require("../validators/honeymoonValidator");
const { normalizeDateOnly } = require("../lib/dateOnly");

const normalizeDate = (date) => normalizeDateOnly(date);

const getHoneymoon = async (req, res, next) => {
  try {
    const items = await getHoneymoonItems(req.user.userId);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const createHoneymoon = async (req, res, next) => {
  try {
    const data = honeymoonItemSchema.parse(req.body);
    const item = await createHoneymoonItem(req.user.userId, {
      ...data,
      date: normalizeDate(data.date),
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateHoneymoon = async (req, res, next) => {
  try {
    const data = honeymoonItemSchema.partial().parse(req.body);
    const item = await updateHoneymoonItem(req.user.userId, req.params.id, {
      ...data,
      date: data.date === undefined ? undefined : normalizeDate(data.date),
    });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const deleteHoneymoon = async (req, res, next) => {
  try {
    const item = await deleteHoneymoonItem(req.user.userId, req.params.id);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHoneymoon,
  createHoneymoon,
  updateHoneymoon,
  deleteHoneymoon,
};
