const {
  getBudgetItems,
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
} = require("../services/budgetService");

const { budgetItemSchema } = require("../validators/budgetValidator");

const getBudget = async (req, res, next) => {
  try {
    const items = await getBudgetItems(req.user.userId);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const createBudget = async (req, res, next) => {
  try {
    const data = budgetItemSchema.parse(req.body);
    const item = await createBudgetItem(req.user.userId, data);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateBudget = async (req, res, next) => {
  try {
    const data = budgetItemSchema.partial().parse(req.body);
    const item = await updateBudgetItem(req.user.userId, req.params.id, data);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    const item = await deleteBudgetItem(req.user.userId, req.params.id);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
};
