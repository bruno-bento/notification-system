import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { checkAdmin, isAuthenticated } from "../services/auth";
import DashboardHome from "../pages/DashboardHome/DashboardHome";
import DashboardLayout from "../components/DashboardLayout";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
};

const AuthRouter: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await checkAdmin();
        setHasAdmin(response.data);
      } catch (error) {
        console.error("Failed to check admin status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated()) {
      checkAdminStatus();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated() ? (
              <Navigate to="/" />
            ) : !hasAdmin ? (
              <Navigate to="/register" />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated() ? (
              <Navigate to="/" />
            ) : hasAdmin ? (
              <Navigate to="/login" />
            ) : (
              <RegisterPage />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AuthRouter;
