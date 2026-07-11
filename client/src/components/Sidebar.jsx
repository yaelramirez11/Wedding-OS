import { NavLink } from "react-router-dom";

import PreferenceControls from "./PreferenceControls.jsx";
import { useTranslation } from "../context/PreferencesContext.jsx";

function Sidebar() {
  const { t } = useTranslation();

  const navItems = [
    { labelKey: "nav.weddingHub", path: "/dashboard/wedding-hub", icon: "⏱️" },
    { labelKey: "nav.dashboard", path: "/dashboard", icon: "❤️‍🔥 " },
    { labelKey: "nav.guests", path: "/dashboard/guests", icon: "🥂" },
    { labelKey: "nav.tables", path: "/dashboard/tables", icon: "🪑" },
    { labelKey: "nav.budget", path: "/dashboard/budget", icon: "💲" },
    { labelKey: "nav.honeymoon", path: "/dashboard/honeymoon", icon: "🏖️" },
    { labelKey: "nav.timeline", path: "/dashboard/timeline", icon: "🛣️ " },
  ];

  return (
    <aside className="w-full lg:w-72 lg:h-screen lg:sticky lg:top-0 lg:self-start overflow-y-auto bg-[#660033] text-white p-4 sm:p-6 flex flex-col">
      <div className="flex lg:block items-center justify-between gap-4 mb-6 lg:mb-10">
        <div className="flex items-center lg:block gap-3">
          <div className="h-12 w-12 rounded-2xl wos-card text-[#660033] flex items-center justify-center font-serif text-lg font-bold lg:mb-5 shadow-sm">
            A&Y
          </div>

          <div>
            <h2 className="text-2xl lg:text-3xl font-serif tracking-tight">
              {t("common.appName")}
            </h2>

            <p className="hidden sm:block text-sm text-white/60 mt-2 leading-relaxed">
              {t("nav.tagline")}
            </p>
          </div>
        </div>

        <div className="lg:hidden">
          <PreferenceControls compact />
        </div>
      </div>

      <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 wos-sidebar-nav max-w-full">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `shrink-0 px-4 py-3 rounded-2xl text-sm font-semibold transition flex items-center gap-3 ${
                isActive
                  ? "wos-card text-[#660033] shadow-sm"
                  : "text-white/70 hover:wos-card/10 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>

      <div className="hidden lg:block mt-auto rounded-3xl wos-card/10 p-4 border border-white/15">
        <p className="text-sm font-semibold">{t("nav.nextMilestone")}</p>
        <p className="text-xs text-white/60 mt-1 leading-relaxed">
          {t("nav.nextMilestoneText")}
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
