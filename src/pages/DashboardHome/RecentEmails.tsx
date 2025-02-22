import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Email } from "../../types/email";
import { NOTIFICATION_STATUS_CONFIG } from "../../types/notification";

interface EmailLogItemProps {
  email: Email;
  config: typeof NOTIFICATION_STATUS_CONFIG;
}

const EmailLogItem: React.FC<EmailLogItemProps> = ({ email, config }) => {
  const statusConfig = config[email.status];
  const Icon = statusConfig.icon;

  return (
    <div className="flex items-center space-x-4 p-3 hover:bg-gray-700 rounded-lg">
      <div className="flex-shrink-0">
        <Icon className={`w-5 h-5 ${statusConfig.className}`} />
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
};

interface RecentEmailsProps {
  emails: Email[];
  config: typeof NOTIFICATION_STATUS_CONFIG;
}

export const RecentEmails: React.FC<RecentEmailsProps> = ({
  emails,
  config,
}) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Últimos Envios (10)</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-2">
          {emails.slice(0, 10).map((email) => (
            <EmailLogItem key={email.id} email={email} config={config} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
