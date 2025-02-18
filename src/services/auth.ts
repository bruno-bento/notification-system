import { ApiResponse, LoginRequest } from "../types/api";

const API_URL = "http://localhost:8080/api/v1";

export const login = async (
  credentials: LoginRequest
): Promise<ApiResponse<string>> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao realizar login");
  }

  const data = await response.json();
  if (data.data) {
    localStorage.setItem("token", data.data);
  }
  return data;
};

export const checkAdmin = async (): Promise<ApiResponse<boolean>> => {
  const response = await fetch(`${API_URL}/users/check-admin`);
  if (!response.ok) {
    throw new Error("Failed to check admin status");
  }
  return response.json();
};

export const setupAdmin = async (
  data: LoginRequest
): Promise<ApiResponse<any>> => {
  const response = await fetch(`${API_URL}/users/setup-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok && response.status !== 200) {
    throw new Error("Failed to setup admin");
  }

  return response.json();
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const logout = (): void => {
  localStorage.removeItem("token");
};
