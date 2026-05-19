import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar.jsx";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F7F4EF] text-gray-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <header className="h-auto lg:h-20 border-b border-black/5 wos-card/70 backdrop-blur-xl px-5 sm:px-8 lg:px-10 py-4 lg:py-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-50">
            <div>
              <p className="text-sm text-gray-500">WeddingOS</p>
              <h1 className="text-lg sm:text-xl font-semibold">
                Our wedding command center, my love!
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left sm:text-right">
                <p className="text-sm font-medium">Yael & Atalia</p>
                <p className="text-xs text-gray-500">Wedding Workspace</p>
              </div>

              <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                Y&A
              </div>
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
