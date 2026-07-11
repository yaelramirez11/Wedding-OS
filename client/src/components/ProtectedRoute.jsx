import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { useTranslation } from "../context/PreferencesContext.jsx";

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen wos-page-bg flex items-center justify-center">
        <div className="wos-card px-8 py-6 text-center">
          <p className="text-sm wos-text-muted">{t("layout.loadingWorkspace")}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
