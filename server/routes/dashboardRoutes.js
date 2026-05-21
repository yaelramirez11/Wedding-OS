const express = require("express");

const router = express.Router();

const {
  getCards,
  createCard,
  updateCard,
  getTasks,
  createTask,
  updateTask,
} = require("../controllers/dashboardController");

router.get("/cards", getCards);
router.post("/cards", createCard);
router.patch("/cards/:id", updateCard);

router.get("/tasks", getTasks);
router.post("/tasks", createTask);
router.patch("/tasks/:id", updateTask);

module.exports = router;
