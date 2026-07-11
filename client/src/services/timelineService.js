import { apiFetch } from "./api.js";

export const fetchTimelineItems = async () => apiFetch("/timeline");

export const createTimelineItem = async (data) =>
  apiFetch("/timeline", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTimelineItem = async (id, data) =>
  apiFetch(`/timeline/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteTimelineItem = async (id) =>
  apiFetch(`/timeline/${id}`, {
    method: "DELETE",
  });
