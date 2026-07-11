import { apiFetch } from "./api.js";

export const fetchBudgetItems = async () => apiFetch("/budget");

export const createBudgetItem = async (data) =>
  apiFetch("/budget", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateBudgetItem = async (id, data) =>
  apiFetch(`/budget/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteBudgetItem = async (id) =>
  apiFetch(`/budget/${id}`, {
    method: "DELETE",
  });
