import { apiFetch } from "./api.js";

export const fetchTables = async () => apiFetch("/tables");

export const fetchUnseatedGuests = async () => apiFetch("/tables/unseated");

export const createTable = async (data) =>
  apiFetch("/tables", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteTable = async (tableId) =>
  apiFetch(`/tables/${tableId}`, {
    method: "DELETE",
  });

export const assignGuestToTable = async (guestId, tableId, seatIndex = undefined) =>
  apiFetch("/tables/assign", {
    method: "PATCH",
    body: JSON.stringify({
      guestId,
      tableId,
      ...(seatIndex !== undefined ? { seatIndex } : {}),
    }),
  });
