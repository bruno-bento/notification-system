// components/DashboardHome.tsx
import React, { useEffect, useState } from "react";
import { format, subDays, parseISO } from "date-fns";
import { StatCard } from "./StatCard";
import { NotificationChart } from "./NotificationChart";
import { RecentEmails } from "./RecentEmails";
import { getEmails } from "../../services/email";
import {
  Email,
  initializeNotificationStats,
  initializeDailyStats,
} from "../../types/email";
import {
  NotificationStats,
  DailyNotificationStats,
  NOTIFICATION_STATUS,
  NOTIFICATION_STATUS_CONFIG,
} from "../../types/notification";

export const DashboardHome: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [stats, setStats] = useState<NotificationStats>(
    initializeNotificationStats()
  );
  const [dailyStats, setDailyStats] = useState<DailyNotificationStats[]>([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await getEmails();
        const emailData = response.data;
        setEmails(emailData);

        const newStats = emailData.reduce((acc, email) => {
          acc.total++;
          acc[
            email.status.toLowerCase() as keyof Omit<NotificationStats, "total">
          ]++;
          return acc;
        }, initializeNotificationStats());
        setStats(newStats);

        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = subDays(new Date(), i);
          return initializeDailyStats(format(date, "yyyy-MM-dd"));
        }).reverse();

        emailData.forEach((email) => {
          const emailDate = format(parseISO(email.createdAt), "yyyy-MM-dd");
          const dayStats = last30Days.find((day) => day.date === emailDate);
          if (dayStats) {
            dayStats[
              email.status.toLowerCase() as keyof Omit<
                DailyNotificationStats,
                "date"
              >
            ]++;
          }
        });
        setDailyStats(last30Days);
      } catch (error) {
        console.error("Failed to fetch emails:", error);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div className="space-y-8 p-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(NOTIFICATION_STATUS).map(([key, status]) => {
          const config = NOTIFICATION_STATUS_CONFIG[status];
          const statusKey = status.toLowerCase() as keyof Omit<
            NotificationStats,
            "total"
          >;
          const Icon = config.icon;
          return (
            <StatCard
              key={key}
              title={config.label}
              value={stats[statusKey]}
              icon={<Icon className={`w-5 h-5 ${config.className}`} />}
              color={config.color}
              total={stats.total}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <NotificationChart data={dailyStats} />
        <RecentEmails emails={emails} config={NOTIFICATION_STATUS_CONFIG} />
      </div>
    </div>
  );
};

export default DashboardHome;
