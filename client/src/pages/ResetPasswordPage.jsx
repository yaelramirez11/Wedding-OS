import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useTranslation } from "../context/PreferencesContext.jsx";
import { resetPassword } from "../services/authService.js";
import AuthLayout from "../layouts/AuthLayout.jsx";

function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError(t("auth.resetLinkInvalid"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.passwordsNoMatch"));
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ token, password });
      navigate("/login", {
        replace: true,
        state: { passwordUpdated: true },
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.resetTitle")}
      subtitle={t("auth.resetSubtitle")}
      footer={
        <p className="wos-text-muted">
          <Link to="/login" className="font-semibold wos-link">
            {t("auth.backToSignIn")}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold wos-text-muted mb-2 block">
            {t("auth.newPassword")}
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
          {loading ? t("auth.updating") : t("auth.updatePassword")}
        </button>
      </form>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
