import { ApiResponse } from "../types/api";
import { Email } from "../types/email";
import { getAuthToken } from "./auth";

const API_URL = "http://localhost:8080/api/v1";

export const getEmails = async (): Promise<ApiResponse<Email[]>> => {
  const response = await fetch(`${API_URL}/emails`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch emails");
  }

  return response.json();
};
