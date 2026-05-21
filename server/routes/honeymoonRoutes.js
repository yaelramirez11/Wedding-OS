const express = require("express");

const router = express.Router();

const {
  getHoneymoon,
  createHoneymoon,
  updateHoneymoon,
  deleteHoneymoon,
} = require("../controllers/honeymoonController");

router.get("/", getHoneymoon);
router.post("/", createHoneymoon);
router.patch("/:id", updateHoneymoon);
router.delete("/:id", deleteHoneymoon);

module.exports = router;
