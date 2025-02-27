export interface SmtpConfig {
  id: number;
  host: string;
  port: number;
  username: string;
  password: string;
  useTls: boolean;
  useSsl: boolean;
  dailyLimit: number;
  monthlyLimit: number;
}

export interface SmtpConfigRequestDTO {
  host: string;
  port: number;
  username: string;
  password: string;
  useTls: boolean;
  useSsl: boolean;
  dailyLimit: number;
  monthlyLimit: number;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message: string;
}
