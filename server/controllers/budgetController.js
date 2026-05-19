const {
  getBudgetItems,
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
} = require("../services/budgetService");

const { budgetItemSchema } = require("../validators/budgetValidator");

const getBudget = async (req, res) => {
  try {
    const items = await getBudgetItems();

    res.json(items);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch budget items",
    });
  }
};

const createBudget = async (req, res) => {
  try {
    const data = budgetItemSchema.parse(req.body);

    const item = await createBudgetItem(data);

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({
      error: error.errors?.[0]?.message || error.message,
    });
  }
};

const updateBudget = async (req, res) => {
  try {
    const data = budgetItemSchema.partial().parse(req.body);

    const item = await updateBudgetItem(req.params.id, data);

    res.json(item);
  } catch (error) {
    res.status(400).json({
      error: error.errors?.[0]?.message || error.message,
    });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const item = await deleteBudgetItem(req.params.id);

    res.json(item);
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete budget item",
    });
  }
};

module.exports = {
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
};
