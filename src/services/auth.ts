import { ApiResponse, LoginRequest } from "../types/api";
import { jwtDecode } from "jwt-decode";
import { apiClient } from "./apiClient";

export const login = async (
  credentials: LoginRequest
): Promise<ApiResponse<string>> => {
  const data = await apiClient.post<string>("/auth/login", credentials, false);

  if (data.data) {
    localStorage.setItem("token", data.data);
  }

  return data;
};

export const checkAdmin = async (): Promise<ApiResponse<boolean>> => {
  return apiClient.get<boolean>("/users/check-admin", false);
};

export const setupAdmin = async (
  data: LoginRequest
): Promise<ApiResponse<any>> => {
  return apiClient.post<any>("/users/setup-admin", data, false);
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  console.log(token);
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const logout = (): void => {
  localStorage.removeItem("token");
};
