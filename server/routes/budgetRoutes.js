const express = require("express");

const router = express.Router();

const {
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

router.get("/", getBudget);
router.post("/", createBudget);
router.patch("/:id", updateBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
