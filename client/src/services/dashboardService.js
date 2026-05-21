const API_URL = "http://localhost:5000";

export const fetchDashboardCards = async () => {
  const response = await fetch(`${API_URL}/dashboard/cards`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard cards");
  }

  return response.json();
};

export const updateDashboardCard = async (id, data) => {
  const response = await fetch(`${API_URL}/dashboard/cards/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update dashboard card");
  }

  return response.json();
};

export const fetchDashboardTasks = async () => {
  const response = await fetch(`${API_URL}/dashboard/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard tasks");
  }

  return response.json();
};

export const createDashboardTask = async (data) => {
  const response = await fetch(`${API_URL}/dashboard/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create dashboard task");
  }

  return response.json();
};

export const updateDashboardTask = async (id, data) => {
  const response = await fetch(`${API_URL}/dashboard/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update dashboard task");
  }

  return response.json();
};

export const createDashboardCard = async (data) => {
  const response = await fetch(`${API_URL}/dashboard/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create dashboard card");
  }

  return response.json();
};
