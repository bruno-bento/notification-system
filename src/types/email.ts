export interface Email {
  id: number;
  recipient: string;
  status: "SENT" | "BOUNCED" | "FAILED";
  retryCount: number;
  createdAt: string;
  sentAt: string | null;
  subject: string;
  body: string;
  trackingId: string;
  openedAt: string | null;
  bounceReason: string | null;
  bounceAt: string | null;
}

export interface EmailStats {
  sent: number;
  bounced: number;
  failed: number;
  total: number;
}

export interface DailyEmailStats {
  date: string;
  sent: number;
  bounced: number;
  failed: number;
}
