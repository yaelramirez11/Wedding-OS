import { Outlet, useNavigate } from "react-router-dom";

import PreferenceControls from "../components/PreferenceControls.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTranslation } from "../context/PreferencesContext.jsx";

function DashboardLayout() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name
        .split(/\s|&|,/)
        .map((part) => part.trim()[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "WOS";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen wos-page-bg">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <header className="h-auto lg:h-20 border-b wos-header backdrop-blur-xl px-5 sm:px-8 lg:px-10 py-4 lg:py-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-50">
            <div>
              <p className="text-sm wos-text-muted">{t("common.appName")}</p>
              <h1 className="text-lg sm:text-xl font-semibold wos-text-heading">
                {t("layout.commandCenter")}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <PreferenceControls />

              <div className="text-left sm:text-right">
                <p className="text-sm font-medium wos-text-heading">
                  {user?.name || t("common.appName")}
                </p>
                <p className="text-xs wos-text-muted">{t("layout.workspace")}</p>
              </div>

              <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                {initials}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-semibold wos-link hover:underline"
              >
                {t("layout.logout")}
              </button>
            </div>
          </header>

          <main className="p-5 sm:p-8 lg:p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
