const {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  assignGuestToTable,
  getUnseatedGuests,
} = require("../services/tableService");

const {
  createTableSchema,
  assignGuestSchema,
} = require("../validators/tableValidator");

const getAllTables = async (req, res, next) => {
  try {
    const tables = await getTables(req.user.userId);
    res.json(tables);
  } catch (error) {
    next(error);
  }
};

const getGuestsWithoutTable = async (req, res, next) => {
  try {
    const guests = await getUnseatedGuests(req.user.userId);
    res.json(guests);
  } catch (error) {
    next(error);
  }
};

const createNewTable = async (req, res, next) => {
  try {
    const data = createTableSchema.parse(req.body);
    const table = await createTable(req.user.userId, data);
    res.status(201).json(table);
  } catch (error) {
    next(error);
  }
};

const updateExistingTable = async (req, res, next) => {
  try {
    const table = await updateTable(req.user.userId, req.params.id, req.body);
    res.json(table);
  } catch (error) {
    next(error);
  }
};

const removeTable = async (req, res, next) => {
  try {
    await deleteTable(req.user.userId, req.params.id);
    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const moveGuest = async (req, res, next) => {
  try {
    const data = assignGuestSchema.parse(req.body);
    const guest = await assignGuestToTable(req.user.userId, data);
    res.json(guest);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTables,
  createNewTable,
  updateExistingTable,
  removeTable,
  moveGuest,
  getGuestsWithoutTable,
};
