import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "❤️‍🔥 " },
  { label: "Guests", path: "/dashboard/guests", icon: "🥂" },
  { label: "Tables", path: "/dashboard/tables", icon: "🪑" },
  { label: "Budget", path: "/dashboard/budget", icon: "💲" },
  { label: "Honeymoon", path: "/dashboard/honeymoon", icon: "🏖️" },
  { label: "Timeline", path: "/dashboard/timeline", icon: "🛣️ " },
];

function Sidebar() {
  return (
    <aside className="w-full lg:w-72 lg:h-screen lg:sticky lg:top-0 lg:self-start overflow-y-auto bg-[#660033] text-white p-4 sm:p-6 flex flex-col">
      <div className="flex lg:block items-center justify-between gap-4 mb-6 lg:mb-10">
        <div className="flex items-center lg:block gap-3">
          <div className="h-12 w-12 rounded-2xl wos-card text-[#660033] flex items-center justify-center font-serif text-lg font-bold lg:mb-5 shadow-sm">
            A&Y
          </div>

          <div>
            <h2 className="text-2xl lg:text-3xl font-serif tracking-tight">
              WeddingOS
            </h2>

            <p className="hidden sm:block text-sm text-white/60 mt-2 leading-relaxed">
              Let's plan beautifully, like you my heart.
            </p>
          </div>
        </div>
      </div>

      <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
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
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden lg:block mt-auto rounded-3xl wos-card/10 p-4 border border-white/15">
        <p className="text-sm font-semibold">Next milestone</p>
        <p className="text-xs text-white/60 mt-1 leading-relaxed">
          Start planning our honeymoon, darling.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
