import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { useTranslation } from "../context/PreferencesContext.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";

function Signup() {
  const { register, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("auth.passwordsNoMatch"));
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password });
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.signupTitle")}
      subtitle={t("auth.signupSubtitle")}
      footer={
        <p className="wos-text-muted">
          {t("auth.hasAccount")}{" "}
          <Link to="/login" className="font-semibold wos-link">
            {t("auth.signIn")}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold wos-text-muted mb-2 block">
            {t("common.name")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("auth.namePlaceholder")}
            className="wos-input"
            minLength={2}
            required
          />
        </div>

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
          <label className="text-xs font-semibold wos-text-muted mb-2 block">
            {t("common.password")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t("auth.passwordMinPlaceholder")}
            className="wos-input"
            minLength={8}
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold wos-text-muted mb-2 block">
            {t("auth.confirmPassword")}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder={t("auth.repeatPasswordPlaceholder")}
            className="wos-input"
            minLength={8}
            required
          />
        </div>

        {error && (
          <p className="text-sm wos-alert-error border rounded-2xl px-4 py-3">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="w-full wos-button">
          {loading ? t("auth.creatingAccount") : t("auth.createAccount")}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Signup;
