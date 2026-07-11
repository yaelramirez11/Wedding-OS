import { apiFetch } from "./api.js";

export const fetchDashboardCards = async () => apiFetch("/dashboard/cards");

export const updateDashboardCard = async (id, data) =>
  apiFetch(`/dashboard/cards/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const fetchDashboardTasks = async () => apiFetch("/dashboard/tasks");

export const createDashboardTask = async (data) =>
  apiFetch("/dashboard/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateDashboardTask = async (id, data) =>
  apiFetch(`/dashboard/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const createDashboardCard = async (data) =>
  apiFetch("/dashboard/cards", {
    method: "POST",
    body: JSON.stringify(data),
  });
