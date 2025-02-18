export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
  details?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CheckAdminResponse {
  data: boolean;
}
