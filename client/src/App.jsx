import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import GuestsPage from "./pages/GuestsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BudgetPage from "./pages/BudgetPage.jsx";
import HoneymoonPage from "./pages/HoneymoonPage.jsx";
import TimelinePage from "./pages/TimelinePage.jsx";
import TablesPage from "./pages/TablesPage.jsx";
import WeddingHubPage from "./pages/WeddingHubPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/wedding-hub" element={<WeddingHubPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/guests" element={<GuestsPage />} />
          <Route path="/dashboard/budget" element={<BudgetPage />} />
          <Route path="/dashboard/honeymoon" element={<HoneymoonPage />} />
          <Route path="/dashboard/timeline" element={<TimelinePage />} />
          <Route path="/dashboard/tables" element={<TablesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
