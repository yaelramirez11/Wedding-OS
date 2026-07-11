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

const getGuests = async (req, res, next) => {
  try {
    const guests = await getAllGuests(req.user.userId);
    res.json(guests);
  } catch (error) {
    next(error);
  }
};

const createGuestHandler = async (req, res, next) => {
  try {
    const validatedData = createGuestSchema.parse(req.body);
    const guest = await createGuest(req.user.userId, validatedData);
    res.status(201).json(guest);
  } catch (error) {
    next(error);
  }
};

const updateGuestHandler = async (req, res, next) => {
  try {
    const validatedData = updateGuestSchema.parse(req.body);
    const guest = await updateGuest(
      req.user.userId,
      req.params.id,
      validatedData,
    );
    res.json(guest);
  } catch (error) {
    next(error);
  }
};

const deleteGuestHandler = async (req, res, next) => {
  try {
    const deletedGuest = await deleteGuest(req.user.userId, req.params.id);
    res.json(deletedGuest);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGuests,
  createGuestHandler,
  updateGuestHandler,
  deleteGuestHandler,
};
