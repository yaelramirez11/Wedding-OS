const router = require("express").Router();

const {
  getAllTables,
  createNewTable,
  updateExistingTable,
  removeTable,
  moveGuest,
  getGuestsWithoutTable,
} = require("../controllers/tableController");

router.get("/", getAllTables);

router.get("/unseated", getGuestsWithoutTable);

router.post("/", createNewTable);

router.patch("/assign", moveGuest);

router.patch("/:id", updateExistingTable);

router.delete("/:id", removeTable);

module.exports = router;
