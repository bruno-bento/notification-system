import { ApiResponse } from "../types/api";
import { Email } from "../types/email";
import { apiClient } from "./apiClient";

export const getEmails = async (): Promise<ApiResponse<Email[]>> => {
  return apiClient.get<Email[]>("/emails");
};
