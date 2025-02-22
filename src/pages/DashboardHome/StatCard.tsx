import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  total: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  total,
}) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl font-bold" style={{ color }}>
              {value} <span className="text-gray-400 text-sm">/ {total}</span>
            </p>
            <p className="mt-1" style={{ color }}>
              {title}
            </p>
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
};
