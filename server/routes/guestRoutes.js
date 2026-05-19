const express = require("express");

const router = express.Router();

const {
  getGuests,
  createGuestHandler,
  updateGuestHandler,
  deleteGuestHandler,
} = require("../controllers/guestController");

router.get("/", getGuests);

router.post("/", createGuestHandler);

router.patch("/:id", updateGuestHandler);

router.delete("/:id", deleteGuestHandler);

module.exports = router;
