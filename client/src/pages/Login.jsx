import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { useTranslation } from "../context/PreferencesContext.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";

function Login() {
  const { login, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/dashboard";
  const successMessage = location.state?.passwordUpdated
    ? t("auth.passwordUpdated")
    : location.state?.message;

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.loginTitle")}
      subtitle={t("auth.loginSubtitle")}
      footer={
        <p className="wos-text-muted">
          {t("auth.noAccount")}{" "}
          <Link to="/signup" className="font-semibold wos-link">
            {t("auth.createOne")}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold wos-text-muted mb-2 block">
            {t("common.email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("auth.emailPlaceholder")}
            className="wos-input"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold wos-text-muted">
              {t("common.password")}
            </label>
            <Link to="/forgot-password" className="text-xs font-semibold wos-link">
              {t("auth.forgotPassword")}
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t("auth.passwordPlaceholder")}
            className="wos-input"
            required
          />
        </div>

        {successMessage && (
          <p className="text-sm wos-alert-success border rounded-2xl px-4 py-3">
            {successMessage}
          </p>
        )}

        {error && (
          <p className="text-sm wos-alert-error border rounded-2xl px-4 py-3">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="w-full wos-button">
          {loading ? t("auth.signingIn") : t("auth.signIn")}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
