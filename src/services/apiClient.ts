import { ApiResponse } from "../types/api";
import { getAuthToken } from "./auth";

const API_URL = "http://localhost:8080/api/v1";

interface RequestOptions {
  method?: string;
  body?: any;
  auth?: boolean;
  contentType?: string;
}

export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      body,
      auth = true,
      contentType = "application/json",
    } = options;

    const headers: Record<string, string> = {
      "Content-Type": contentType,
    };

    if (auth) {
      const token = getAuthToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body)
      config.body =
        contentType === "application/json" ? JSON.stringify(body) : body;

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Erro desconhecido" }));
        throw new Error(
          errorData.message || `Erro ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in ${method} ${endpoint}:`, error);
      throw error;
    }
  },

  get<T>(endpoint: string, auth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { auth });
  },

  post<T>(endpoint: string, data: any, auth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body: data, auth });
  },

  put<T>(endpoint: string, data: any, auth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body: data, auth });
  },

  delete<T>(endpoint: string, auth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", auth });
  },
};
