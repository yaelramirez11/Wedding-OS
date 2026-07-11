import { useState } from "react";
import { Link } from "react-router-dom";

import { useTranslation } from "../context/PreferencesContext.jsx";
import { requestPasswordReset } from "../services/authService.js";
import AuthLayout from "../layouts/AuthLayout.jsx";

function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setMessage(t("auth.resetEmailSent"));
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.forgotTitle")}
      subtitle={t("auth.forgotSubtitle")}
      footer={
        <p className="wos-text-muted">
          {t("auth.rememberedPassword")}{" "}
          <Link to="/login" className="font-semibold wos-link">
            {t("auth.backToSignIn")}
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

        {error && (
          <p className="text-sm wos-alert-error border rounded-2xl px-4 py-3">
            {error}
          </p>
        )}

        {message && (
          <p className="text-sm wos-alert-success border rounded-2xl px-4 py-3">
            {message}
          </p>
        )}

        <button type="submit" disabled={loading} className="w-full wos-button">
          {loading ? t("auth.sending") : t("auth.sendResetLink")}
        </button>
      </form>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
