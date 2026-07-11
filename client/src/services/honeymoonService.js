import { apiFetch } from "./api.js";

export const fetchHoneymoonItems = async () => apiFetch("/honeymoon");

export const createHoneymoonItem = async (data) =>
  apiFetch("/honeymoon", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateHoneymoonItem = async (id, data) =>
  apiFetch(`/honeymoon/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteHoneymoonItem = async (id) =>
  apiFetch(`/honeymoon/${id}`, {
    method: "DELETE",
  });
