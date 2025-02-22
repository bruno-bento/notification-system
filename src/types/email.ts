import {
  DailyNotificationStats,
  NOTIFICATION_STATUS,
  NotificationStats,
  NotificationStatus,
  StatusToNumber,
} from "./notification";

export interface Email {
  id: number;
  recipient: string;
  status: NotificationStatus;
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

export const initializeNotificationStats = (): NotificationStats => {
  const stats = Object.values(NOTIFICATION_STATUS).reduce(
    (acc, status) => ({
      ...acc,
      [status.toLowerCase()]: 0,
    }),
    {} as StatusToNumber
  );

  return {
    ...stats,
    total: 0,
  };
};

export const initializeDailyStats = (date: string): DailyNotificationStats => {
  const stats = Object.values(NOTIFICATION_STATUS).reduce(
    (acc, status) => ({
      ...acc,
      [status.toLowerCase()]: 0,
    }),
    {} as StatusToNumber
  );

  return {
    ...stats,
    date,
  };
};
