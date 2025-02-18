import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getEmails } from "../services/email";
import { Email, EmailStats, DailyEmailStats } from "../types/email";
import { format, subDays, parseISO } from "date-fns";

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card className="bg-gray-800 border-gray-700">
    <CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-bold" style={{ color }}>
            {value}
          </p>
          <p className="text-gray-400 mt-1">{title}</p>
        </div>
        <div
          className="p-2 rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const EmailLogItem: React.FC<{ email: Email }> = ({ email }) => (
  <div className="flex items-center space-x-4 p-3 hover:bg-gray-800 rounded-lg">
    <div className="flex-shrink-0">
      {email.status === "SENT" && (
        <CheckCircle className="w-5 h-5 text-green-500" />
      )}
      {email.status === "BOUNCED" && (
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
      )}
      {email.status === "FAILED" && (
        <XCircle className="w-5 h-5 text-red-500" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-white truncate">
        {email.recipient}
      </p>
      <p className="text-sm text-gray-400 truncate">{email.subject}</p>
    </div>
    <div className="text-xs text-gray-400">
      {format(parseISO(email.createdAt), "HH:mm")}
    </div>
  </div>
);

const DashboardHome: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [stats, setStats] = useState<EmailStats>({
    sent: 0,
    bounced: 0,
    failed: 0,
    total: 0,
  });
  const [dailyStats, setDailyStats] = useState<DailyEmailStats[]>([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await getEmails();
        const emailData = response.data;
        setEmails(emailData);

        // Calculate stats
        const newStats = emailData.reduce(
          (acc, email) => {
            acc.total++;
            if (email.status === "SENT") acc.sent++;
            if (email.status === "BOUNCED") acc.bounced++;
            if (email.status === "FAILED") acc.failed++;
            return acc;
          },
          { sent: 0, bounced: 0, failed: 0, total: 0 }
        );
        setStats(newStats);

        // Generate daily stats for the last 30 days
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = subDays(new Date(), i);
          return {
            date: format(date, "yyyy-MM-dd"),
            sent: 0,
            bounced: 0,
            failed: 0,
          };
        }).reverse();

        emailData.forEach((email) => {
          const emailDate = format(parseISO(email.createdAt), "yyyy-MM-dd");
          const dayStats = last30Days.find((day) => day.date === emailDate);
          if (dayStats) {
            if (email.status === "SENT") dayStats.sent++;
            if (email.status === "BOUNCED") dayStats.bounced++;
            if (email.status === "FAILED") dayStats.failed++;
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Enviados"
          value={stats.sent}
          icon={<CheckCircle className="w-6 h-6 text-green-500" />}
          color="#22c55e"
        />
        <StatCard
          title="Bounced"
          value={stats.bounced}
          icon={<AlertTriangle className="w-6 h-6 text-yellow-500" />}
          color="#eab308"
        />
        <StatCard
          title="Falhas"
          value={stats.failed}
          icon={<XCircle className="w-6 h-6 text-red-500" />}
          color="#ef4444"
        />
        <StatCard
          title="Total"
          value={stats.total}
          icon={<Mail className="w-6 h-6 text-blue-500" />}
          color="#3b82f6"
        />
      </div>

      {/* Chart and Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Envios nos últimos 30 dias
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      tickFormatter={(value: any) =>
                        format(parseISO(value), "dd/MM")
                      }
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                      }}
                      labelStyle={{ color: "#9CA3AF" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sent"
                      stroke="#22c55e"
                      name="Enviados"
                    />
                    <Line
                      type="monotone"
                      dataKey="bounced"
                      stroke="#eab308"
                      name="Bounced"
                    />
                    <Line
                      type="monotone"
                      dataKey="failed"
                      stroke="#ef4444"
                      name="Falhas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs */}
        <div>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Últimos Envios
              </h3>
              <div className="space-y-2">
                {emails.slice(0, 10).map((email) => (
                  <EmailLogItem key={email.id} email={email} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
