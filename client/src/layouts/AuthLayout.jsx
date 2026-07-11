import PreferenceControls from "../components/PreferenceControls.jsx";

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen wos-page-bg flex items-center justify-center p-5 sm:p-8">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <PreferenceControls />
        </div>

        <div className="text-center mb-8">
          <div className="mx-auto mb-5 h-14 w-14 rounded-2xl wos-card wos-link flex items-center justify-center font-serif text-xl font-bold shadow-sm">
            A&Y
          </div>

          <h1 className="text-3xl font-serif font-semibold wos-text-heading">
            {title}
          </h1>

          <p className="text-sm wos-text-muted mt-2">{subtitle}</p>
        </div>

        <div className="wos-card p-6 sm:p-8 overflow-hidden relative">
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[var(--wos-rose-soft)]" />
          <div className="relative z-10">{children}</div>
        </div>

        {footer && <div className="text-center mt-6 text-sm">{footer}</div>}
      </div>
    </div>
  );
}

export default AuthLayout;
