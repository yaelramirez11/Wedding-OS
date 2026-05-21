import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout.jsx";
import GuestsPage from "./pages/GuestsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BudgetPage from "./pages/BudgetPage.jsx";
import HoneymoonPage from "./pages/HoneymoonPage.jsx";
import TimelinePage from "./pages/TimelinePage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/guests" element={<GuestsPage />} />
        <Route path="/dashboard/budget" element={<BudgetPage />} />
        <Route path="/dashboard/honeymoon" element={<HoneymoonPage />} />
        <Route path="/dashboard/timeline" element={<TimelinePage />} />
      </Route>
    </Routes>
  );
}

export default App;
