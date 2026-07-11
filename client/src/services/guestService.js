import { apiFetch } from "./api.js";

export const fetchGuests = async () => apiFetch("/guests");

export const createGuest = async (guestData) =>
  apiFetch("/guests", {
    method: "POST",
    body: JSON.stringify(guestData),
  });

export const updateGuest = async (id, guestData) =>
  apiFetch(`/guests/${id}`, {
    method: "PATCH",
    body: JSON.stringify(guestData),
  });

export const deleteGuest = async (id) =>
  apiFetch(`/guests/${id}`, {
    method: "DELETE",
  });
