import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Key, FileText, Settings } from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  to,
  isActive,
}) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
      isActive
        ? "bg-yellow-500 text-gray-900"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`}
  >
    {icon}
    <span className="font-medium">{text}</span>
  </Link>
);

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Mail className="w-8 h-8 text-yellow-500" />
          <span className="text-white text-xl font-bold">NotifySystem</span>
        </div>
        <nav className="space-y-2">
          <SidebarItem
            icon={<Mail className="w-5 h-5" />}
            text="Dashboard"
            to="/"
            isActive={location.pathname === "/"}
          />
          <SidebarItem
            icon={<Settings className="w-5 h-5" />}
            text="SMTP"
            to="/smtp"
            isActive={location.pathname === "/smtp"}
          />
          <SidebarItem
            icon={<Key className="w-5 h-5" />}
            text="Token"
            to="/token"
            isActive={location.pathname === "/token"}
          />
          <SidebarItem
            icon={<FileText className="w-5 h-5" />}
            text="Template"
            to="/template"
            isActive={location.pathname === "/template"}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
