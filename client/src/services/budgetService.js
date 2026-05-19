const API_URL = "http://localhost:5000";

export const fetchBudgetItems = async () => {
  const response = await fetch(`${API_URL}/budget`);

  if (!response.ok) {
    throw new Error("Failed to fetch budget");
  }

  return response.json();
};

export const createBudgetItem = async (data) => {
  const response = await fetch(`${API_URL}/budget`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create budget item");
  }

  return response.json();
};

export const updateBudgetItem = async (id, data) => {
  const response = await fetch(`${API_URL}/budget/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update budget item");
  }

  return response.json();
};

export const deleteBudgetItem = async (id) => {
  const response = await fetch(`${API_URL}/budget/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete budget item");
  }

  return response.json();
};
