const router = require("express").Router();

const {
  getAllTables,
  createNewTable,
  updateExistingTable,
  mergeExistingTables,
  splitMergedTable,
  removeTable,
  moveGuest,
  getGuestsWithoutTable,
} = require("../controllers/tableController");

router.get("/", getAllTables);

router.get("/unseated", getGuestsWithoutTable);

router.post("/", createNewTable);

router.post("/merge", mergeExistingTables);

router.post("/unmerge", splitMergedTable);

router.patch("/assign", moveGuest);

router.patch("/:id", updateExistingTable);

router.delete("/:id", removeTable);

module.exports = router;
