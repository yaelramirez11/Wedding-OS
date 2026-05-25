const API_URL = "http://localhost:5000";

export const fetchTables = async () => {
  const response = await fetch(`${API_URL}/tables`);

  if (!response.ok) {
    throw new Error("Failed to fetch tables");
  }

  return response.json();
};

export const fetchUnseatedGuests = async () => {
  const response = await fetch(`${API_URL}/tables/unseated`);

  if (!response.ok) {
    throw new Error("Failed to fetch unseated guests");
  }

  return response.json();
};

export const createTable = async (data) => {
  const response = await fetch(`${API_URL}/tables`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create table");
  }

  return response.json();
};

export const assignGuestToTable = async (guestId, tableId) => {
  const response = await fetch(`${API_URL}/tables/assign`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      guestId,
      tableId,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to assign guest");
  }

  return response.json();
};
