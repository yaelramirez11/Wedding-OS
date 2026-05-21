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

const getCards = async (req, res) => {
  try {
    const cards = await getDashboardCards();
    res.json(cards);
  } catch {
    res.status(500).json({ error: "Failed to fetch dashboard cards" });
  }
};

const createCard = async (req, res) => {
  try {
    const data = dashboardCardSchema.parse(req.body);
    const card = await createDashboardCard(data);
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({
      error: error.errors?.[0]?.message || error.message,
    });
  }
};

const updateCard = async (req, res) => {
  try {
    const data = dashboardCardSchema.partial().parse(req.body);
    const card = await updateDashboardCard(req.params.id, data);
    res.json(card);
  } catch (error) {
    res.status(400).json({
      error: error.errors?.[0]?.message || error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await getDashboardTasks();
    res.json(tasks);
  } catch {
    res.status(500).json({ error: "Failed to fetch dashboard tasks" });
  }
};

const createTask = async (req, res) => {
  try {
    const data = dashboardTaskSchema.parse(req.body);
    const task = await createDashboardTask(data);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({
      error: error.errors?.[0]?.message || error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const data = dashboardTaskSchema.partial().parse(req.body);
    const task = await updateDashboardTask(req.params.id, data);
    res.json(task);
  } catch (error) {
    res.status(400).json({
      error: error.errors?.[0]?.message || error.message,
    });
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
