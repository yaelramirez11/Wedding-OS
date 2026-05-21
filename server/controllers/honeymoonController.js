const {
  getHoneymoonItems,
  createHoneymoonItem,
  updateHoneymoonItem,
  deleteHoneymoonItem,
} = require("../services/honeymoonService");

const { honeymoonItemSchema } = require("../validators/honeymoonValidator");

const normalizeDate = (date) => {
  if (!date) return null;

  return new Date(date);
};

const getHoneymoon = async (req, res) => {
  try {
    const items = await getHoneymoonItems();

    res.json(items);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch honeymoon items",
    });
  }
};

const createHoneymoon = async (req, res) => {
  try {
    const data = honeymoonItemSchema.parse(req.body);

    const item = await createHoneymoonItem({
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

const updateHoneymoon = async (req, res) => {
  try {
    const data = honeymoonItemSchema.partial().parse(req.body);

    const item = await updateHoneymoonItem(req.params.id, {
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

const deleteHoneymoon = async (req, res) => {
  try {
    const item = await deleteHoneymoonItem(req.params.id);

    res.json(item);
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete honeymoon item",
    });
  }
};

module.exports = {
  getHoneymoon,
  createHoneymoon,
  updateHoneymoon,
  deleteHoneymoon,
};
