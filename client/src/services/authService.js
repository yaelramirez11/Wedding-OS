import { apiFetch, clearToken, setToken } from "./api.js";

export const register = async ({ name, email, password }) => {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  setToken(data.token);
  return data;
};

export const login = async ({ email, password }) => {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setToken(data.token);
  return data;
};

export const fetchCurrentUser = async () => {
  return apiFetch("/auth/me");
};

export const requestPasswordReset = async (email) => {
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async ({ token, password }) => {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
};

export const logout = () => {
  clearToken();
};
