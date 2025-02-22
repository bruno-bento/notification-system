import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { format, parseISO } from "date-fns";
import {
  DailyNotificationStats,
  NOTIFICATION_STATUS_CONFIG,
  NOTIFICATION_STATUS,
} from "../../types/notification";

interface NotificationChartProps {
  data: DailyNotificationStats[];
}

export const NotificationChart: React.FC<NotificationChartProps> = ({
  data,
}) => {
  return (
    <Card className="bg-gray-800 border-gray-700 h-[500px]">
      <CardHeader>
        <CardTitle className="text-white">Envios nos últimos 30 dias</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] p-0 pr-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => format(parseISO(value), "dd/MM")}
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
              }}
              labelStyle={{ color: "#9CA3AF" }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
            {Object.entries(NOTIFICATION_STATUS).map(([key, status]) => {
              const config = NOTIFICATION_STATUS_CONFIG[status];
              const statusKey = status.toLowerCase();
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={statusKey}
                  name={config.label}
                  stroke={config.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: config.color }}
                  activeDot={{ r: 6 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
