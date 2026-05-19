const API_URL = "http://localhost:5000";

export const fetchGuests = async () => {
  const response = await fetch(`${API_URL}/guests`);

  if (!response.ok) {
    throw new Error("Failed to fetch guests");
  }

  return response.json();
};

export const createGuest = async (guestData) => {
  const response = await fetch(`${API_URL}/guests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(guestData),
  });

  if (!response.ok) {
    throw new Error("Failed to create guest");
  }

  return response.json();
};

export const updateGuest = async (id, guestData) => {
  const response = await fetch(`${API_URL}/guests/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(guestData),
  });

  if (!response.ok) {
    throw new Error("Failed to update guest");
  }

  return response.json();
};

export const deleteGuest = async (id) => {
  const response = await fetch(`${API_URL}/guests/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete guest");
  }

  return response.json();
};
