const router = require("express").Router();

const {
  getAllTables,
  createNewTable,
  updateExistingTable,
  mergeExistingTables,
  removeTable,
  moveGuest,
  getGuestsWithoutTable,
} = require("../controllers/tableController");

router.get("/", getAllTables);

router.get("/unseated", getGuestsWithoutTable);

router.post("/", createNewTable);

router.post("/merge", mergeExistingTables);

router.patch("/assign", moveGuest);

router.patch("/:id", updateExistingTable);

router.delete("/:id", removeTable);

module.exports = router;
