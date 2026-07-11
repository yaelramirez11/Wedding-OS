const {
  getDashboardCards,
  createDashboardCard,
  updateDashboardCard,
  getDashboardTasks,
  createDashboardTask,
  updateDashboardTask,
} = require("../services/dashboardService");

const {
  dashboardCardSchema,
  dashboardTaskSchema,
} = require("../validators/dashboardValidator");

const getCards = async (req, res, next) => {
  try {
    const cards = await getDashboardCards(req.user.userId);
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  try {
    const data = dashboardCardSchema.parse(req.body);
    const card = await createDashboardCard(req.user.userId, data);
    res.status(201).json(card);
  } catch (error) {
    next(error);
  }
};

const updateCard = async (req, res, next) => {
  try {
    const data = dashboardCardSchema.partial().parse(req.body);
    const card = await updateDashboardCard(req.user.userId, req.params.id, data);
    res.json(card);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await getDashboardTasks(req.user.userId);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const data = dashboardTaskSchema.parse(req.body);
    const task = await createDashboardTask(req.user.userId, data);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const data = dashboardTaskSchema.partial().parse(req.body);
    const task = await updateDashboardTask(req.user.userId, req.params.id, data);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCards,
  createCard,
  updateCard,
  getTasks,
  createTask,
  updateTask,
};
