import { apiFetch } from "./api.js";

export const fetchTables = async () => apiFetch("/tables");

export const fetchUnseatedGuests = async () => apiFetch("/tables/unseated");

export const createTable = async (data) =>
  apiFetch("/tables", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const assignGuestToTable = async (guestId, tableId) =>
  apiFetch("/tables/assign", {
    method: "PATCH",
    body: JSON.stringify({
      guestId,
      tableId,
    }),
  });
