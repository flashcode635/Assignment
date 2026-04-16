"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Login failed");
      }

      // Store the access token
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      // Redirect based on role
      if (data.user?.role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#fffdf3]">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#0a2744]/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-[#041523]/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-[#0f3a5f]/6 rounded-full blur-[120px] animate-pulse [animation-delay:4s]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(4,21,35,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(4,21,35,.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-4 mt-3">
        {/* Logo / Brand */}
        <div className="text-center mb-4 flex items-center justify-center gap-3">
          {/*svg  */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-[#041523] to-[#0a2744] mb-4 shadow-lg shadow-[#041523]/15">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-[#fffdf3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
              />
            </svg>
          </div>
          {/* content */}
          <div>
            <h1 className="text-2xl font-bold text-[#041523] tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-[#041523]/50 mt-1">
              Sign in to your account
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="backdrop-blur-sm bg-[#041523]/3 border border-[#041523]/15 rounded-2xl p-6 shadow-2xl shadow-[#041523]/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-medium text-[#041523]/60 mb-1.5 uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-[#041523]/5 border border-[#041523]/15 text-[#041523] placeholder-[#041523]/30 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#0a2744]/40 focus:border-[#0a2744]/50
                  transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-medium text-[#041523]/60 uppercase tracking-wider"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#041523]/5 border border-[#041523]/15 text-[#041523] placeholder-[#041523]/30 text-sm
                    focus:outline-none focus:ring-2 focus:ring-[#0a2744]/40 focus:border-[#0a2744]/50
                    transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#041523]/40 hover:text-[#041523]/70 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-medium text-[#041523]/60 mb-1.5 uppercase tracking-wider">
                Sign in as
              </label>
              <div className="flex gap-2">
                {(["USER", "ADMIN"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      role === r
                        ? "bg-[#0a2744]/15 border-[#0a2744]/40 text-[#041523] shadow-inner"
                        : "bg-[#041523]/3 border-[#041523]/10 text-[#041523]/50 hover:border-[#041523]/20 hover:text-[#041523]/70"
                    }`}
                  >
                    {r === "USER" ? "👤 User" : "🛡️ Admin"}
                  </button>
                ))}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                  loading
                    ? "bg-[#041523]/20 text-[#041523]/40 cursor-not-allowed"
                    : "bg-linear-to-r from-[#041523] to-[#0a2744] text-[#fffdf3] hover:shadow-lg hover:shadow-[#041523]/20 hover:-translate-y-0.5 active:translate-y-0"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#041523]/10" />
            <span className="text-xs text-[#041523]/40">or</span>
            <div className="flex-1 h-px bg-[#041523]/10" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-[#041523]/60">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#0a2744] hover:text-[#041523] font-medium transition-colors underline decoration-[#0a2744]/30 hover:decoration-[#041523]/50"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#041523]/30 mt-4">
          Secure authentication with encrypted tokens.
        </p>
      </div>
    </div>
  );
}
