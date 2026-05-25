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

const getAllTables = async (req, res) => {
  try {
    const tables = await getTables();

    res.json(tables);
  } catch {
    res.status(500).json({
      error: "Failed to load tables",
    });
  }
};

const getGuestsWithoutTable = async (req, res) => {
  try {
    const guests = await getUnseatedGuests();

    res.json(guests);
  } catch {
    res.status(500).json({
      error: "Failed to load guests",
    });
  }
};

const createNewTable = async (req, res) => {
  try {
    const data = createTableSchema.parse(req.body);

    const table = await createTable(data);

    res.status(201).json(table);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const updateExistingTable = async (req, res) => {
  try {
    const table = await updateTable(req.params.id, req.body);

    res.json(table);
  } catch {
    res.status(400).json({
      error: "Update failed",
    });
  }
};

const removeTable = async (req, res) => {
  try {
    await deleteTable(req.params.id);

    res.json({
      success: true,
    });
  } catch {
    res.status(400).json({
      error: "Delete failed",
    });
  }
};

const moveGuest = async (req, res) => {
  try {
    const data = assignGuestSchema.parse(req.body);

    const guest = await assignGuestToTable(data);

    res.json(guest);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
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
