import { SmtpConfig, SmtpConfigRequestDTO } from "@/types/smtp";
import { ApiResponse } from "../types/api";
import { apiClient } from "./apiClient";

export const listAllSmtp = async (): Promise<ApiResponse<SmtpConfig[]>> => {
  return apiClient.get<SmtpConfig[]>("/smtp");
};

export const createSmtp = async (
  config: SmtpConfigRequestDTO
): Promise<ApiResponse<SmtpConfig>> => {
  return apiClient.post<SmtpConfig>("/smtp", config);
};

export const updateSmtp = async (
  id: number,
  config: SmtpConfigRequestDTO
): Promise<ApiResponse<SmtpConfig>> => {
  return apiClient.put<SmtpConfig>(`/smtp/${id}`, config);
};

export const deleteSmtp = async (id: number): Promise<ApiResponse<void>> => {
  return apiClient.delete<void>(`/smtp/${id}`);
};
