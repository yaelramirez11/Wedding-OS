const express = require("express");

const router = express.Router();

const {
  getTimeline,
  createTimeline,
  updateTimeline,
  deleteTimeline,
} = require("../controllers/timelineController");

router.get("/", getTimeline);
router.post("/", createTimeline);
router.patch("/:id", updateTimeline);
router.delete("/:id", deleteTimeline);

module.exports = router;
