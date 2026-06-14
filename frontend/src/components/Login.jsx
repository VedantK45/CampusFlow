import { useState } from "react";

// ── Change this to your actual backend URL ──────────────────────────────────
const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`;

const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const handleGoogleLogin = () => {
  //   setLoading(true);
  //   setError("");

  //   // Open your backend's Google OAuth endpoint in a popup
  //   const popup = window.open(
  //     `${BACKEND_URL}/auth/google`,
  //     "google_oauth",
  //     "width=500,height=620,scrollbars=yes,resizable=yes"
  //   );

  //   if (!popup) {
  //     setError("Popup was blocked. Please allow popups for this site and try again.");
  //     setLoading(false);
  //     return;
  //   }

  //   // Your backend OAuth callback page should call:
  //   // window.opener.postMessage({ type: "AUTH_SUCCESS", token: "...", user: {...} }, "*")
  //   const onMessage = async (event) => {
  //     // Optional: tighten origin check → if (event.origin !== BACKEND_URL) return;
  //     if (!event.data || event.data.type !== "AUTH_SUCCESS") return;

  //     window.removeEventListener("message", onMessage);
  //     popup.close();

  //     const { token, user } = event.data;

  //     try {
  //       // Send token + user info to your backend to store refresh token
  //       const res = await fetch(`${BACKEND_URL}/auth/store`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ token, user }),
  //       });

  //       if (!res.ok) throw new Error("Backend returned an error");

  //       const data = await res.json();

  //       // Save session token for future requests
  //       localStorage.setItem("campusflow_token", data.sessionToken || token);

  //       // Redirect to dashboard (adjust path as needed)
  //       window.location.href = "/dashboard";
  //     } catch (err) {
  //       setError("Login succeeded but failed to save your session. Please try again.");
  //       setLoading(false);
  //     }
  //   };

  //   window.addEventListener("message", onMessage);

  //   // Detect if user closes popup without completing auth
  //   const pollClosed = setInterval(() => {
  //     if (popup.closed) {
  //       clearInterval(pollClosed);
  //       window.removeEventListener("message", onMessage);
  //       setLoading(false);
  //     }
  //   }, 600);
  // };

  const handleGoogleLogin = () => {
    setLoading(true);
    setError("");

    const popup = window.open(
      `${BACKEND_URL}/auth/google`,
      "google_oauth",
      "width=500,height=620,scrollbars=yes,resizable=yes",
    );

    if (!popup) {
      setError("Popup was blocked. Please allow popups and try again.");

      setLoading(false);

      return;
    }

    const onMessage = (event) => {
      if (!event.data || event.data.type !== "AUTH_SUCCESS") {
        return;
      }

      window.removeEventListener("message", onMessage);

      popup.close();

      const { token, user } = event.data;

      // Save JWT
      localStorage.setItem("campusflow_token", token);

      // Save user
      localStorage.setItem("campusflow_user", JSON.stringify(user));

      setLoading(false);

      // redirect
      window.location.href = "/dashboard";
    };

    window.addEventListener("message", onMessage);

    const pollClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollClosed);

        window.removeEventListener("message", onMessage);

        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-140px] left-[-140px] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[420px] h-[420px] rounded-full bg-violet-600/15 blur-[110px] pointer-events-none" />

      {/* Dot-grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #818CF8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            CampusFlow
          </h1>
          <p className="text-slate-400 text-sm mt-1">AI OS for Student Life</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-1">Sign in</h2>
          <p className="text-slate-400 text-sm mb-7 leading-relaxed">
            Use your university Google account to access your daily digest and
            campus updates.
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white text-slate-800 font-semibold text-sm hover:bg-slate-100 active:scale-[0.98] transition-all duration-150 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="animate-spin w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <GoogleIcon />
            )}
            {loading ? "Connecting…" : "Continue with Google"}
          </button>

          <p className="text-center text-slate-600 text-xs mt-6 leading-relaxed">
            By signing in you allow CampusFlow to read your Gmail for digest
            generation. Your data is encrypted on AWS S3.
          </p>
        </div>
      </div>
    </div>
  );
}
