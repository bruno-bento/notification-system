import React, { ReactNode } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { checkAdmin, isAuthenticated } from "../services/auth";
import DashboardHome from "../pages/DashboardHome/DashboardHome";
import DashboardLayout from "../components/DashboardLayout";
import SMTPPage from "@/pages/SMTPPage";

interface RouteConfig {
  path: string;
  component: ReactNode;
  protected: boolean;
}

const AuthRouter = () => {
  const [loading, setLoading] = React.useState(true);
  const [hasAdmin, setHasAdmin] = React.useState(false);

  React.useEffect(() => {
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

  const routesConfig: RouteConfig[] = [
    {
      path: "/",
      component: <DashboardHome />,
      protected: true,
    },
    {
      path: "/login",
      component: hasAdmin ? <LoginPage /> : <Navigate to="/register" />,
      protected: false,
    },
    {
      path: "/register",
      component: !hasAdmin ? <RegisterPage /> : <Navigate to="/login" />,
      protected: false,
    },
    {
      path: "/smtp",
      component: <SMTPPage />,
      protected: true,
    },
  ];

  const RouteWrapper: React.FC<{ route: RouteConfig }> = ({ route }) => {
    const location = useLocation();
    if (route.protected && !isAuthenticated()) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return route.protected ? (
      <DashboardLayout>{route.component}</DashboardLayout>
    ) : (
      route.component
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {routesConfig.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<RouteWrapper route={route} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default AuthRouter;
