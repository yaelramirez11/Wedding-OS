const {
  getAllGuests,
  createGuest,
  updateGuest,
  deleteGuest,
} = require("../services/guestService");

const {
  createGuestSchema,
  updateGuestSchema,
} = require("../validators/guestValidator");

const getGuests = async (req, res) => {
  try {
    const guests = await getAllGuests();

    res.json(guests);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch guests",
    });
  }
};

const createGuestHandler = async (req, res) => {
  try {
    const validatedData = createGuestSchema.parse(req.body);

    const guest = await createGuest(validatedData);

    res.status(201).json(guest);
  } catch (error) {
    res.status(400).json({
      error: error.errors?.[0]?.message || error.message,
    });
  }
};

const updateGuestHandler = async (req, res) => {
  try {
    const validatedData = updateGuestSchema.parse(req.body);

    const guest = await updateGuest(req.params.id, validatedData);

    res.json(guest);
  } catch (error) {
    res.status(400).json({
      error: error.errors?.[0]?.message || error.message,
    });
  }
};

const deleteGuestHandler = async (req, res) => {
  try {
    const deletedGuest = await deleteGuest(req.params.id);

    res.json(deletedGuest);
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete guest",
    });
  }
};

module.exports = {
  getGuests,
  createGuestHandler,
  updateGuestHandler,
  deleteGuestHandler,
};
