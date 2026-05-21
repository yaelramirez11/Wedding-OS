const API_URL = "http://localhost:5000";

export const fetchHoneymoonItems = async () => {
  const response = await fetch(`${API_URL}/honeymoon`);

  if (!response.ok) {
    throw new Error("Failed to fetch honeymoon items");
  }

  return response.json();
};

export const createHoneymoonItem = async (data) => {
  const response = await fetch(`${API_URL}/honeymoon`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create honeymoon item");
  }

  return response.json();
};

export const updateHoneymoonItem = async (id, data) => {
  const response = await fetch(`${API_URL}/honeymoon/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update honeymoon item");
  }

  return response.json();
};

export const deleteHoneymoonItem = async (id) => {
  const response = await fetch(`${API_URL}/honeymoon/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete honeymoon item");
  }

  return response.json();
};
