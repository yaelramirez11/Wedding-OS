const API_URL = "http://localhost:5000";

export const fetchTimelineItems = async () => {
  const response = await fetch(`${API_URL}/timeline`);
  if (!response.ok) throw new Error("Failed to fetch timeline");
  return response.json();
};

export const createTimelineItem = async (data) => {
  const response = await fetch(`${API_URL}/timeline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create timeline item");
  return response.json();
};

export const updateTimelineItem = async (id, data) => {
  const response = await fetch(`${API_URL}/timeline/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update timeline item");
  return response.json();
};

export const deleteTimelineItem = async (id) => {
  const response = await fetch(`${API_URL}/timeline/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete timeline item");
  return response.json();
};
