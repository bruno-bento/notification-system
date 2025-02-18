import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logout } from "../services/auth";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Home</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Bem-vindo ao sistema de notificações!
          </p>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
