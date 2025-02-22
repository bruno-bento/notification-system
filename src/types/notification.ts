import {
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MailOpen,
} from "lucide-react";

export const NOTIFICATION_STATUS = {
  SENT: "SENT",
  OPENED: "OPENED",
  BOUNCED: "BOUNCED",
  FAILED: "FAILED",
  PENDING: "PENDING",
} as const;

export type NotificationStatus =
  (typeof NOTIFICATION_STATUS)[keyof typeof NOTIFICATION_STATUS];

export const NOTIFICATION_STATUS_CONFIG = {
  [NOTIFICATION_STATUS.SENT]: {
    icon: CheckCircle,
    color: "#7bf1a8",
    label: "Total Enviados",
    className: "text-green-300",
  },
  [NOTIFICATION_STATUS.BOUNCED]: {
    icon: AlertTriangle,
    color: "#eab308",
    label: "Bounced",
    className: "text-yellow-500",
  },
  [NOTIFICATION_STATUS.FAILED]: {
    icon: XCircle,
    color: "#ef4444",
    label: "Falhas",
    className: "text-red-500",
  },
  [NOTIFICATION_STATUS.OPENED]: {
    icon: MailOpen,
    color: "#5ea500",
    label: "Abertos",
    className: "text-lime-600",
  },
  [NOTIFICATION_STATUS.PENDING]: {
    icon: Mail,
    color: "#3b82f6",
    label: "Pendentes",
    className: "text-blue-500",
  },
} as const;

export type StatusToNumber = {
  [K in NotificationStatus]: number;
};

export type NotificationStats = StatusToNumber & {
  total: number;
};

export type DailyNotificationStats = StatusToNumber & {
  date: string;
};
