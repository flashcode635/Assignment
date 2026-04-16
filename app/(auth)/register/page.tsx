"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

interface PasswordStrength {
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasMinLength: boolean;
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordStrength: PasswordStrength = {
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasMinLength: password.length >= 8,
  };

  const allPassed = Object.values(passwordStrength).every(Boolean);
  const passedCount = Object.values(passwordStrength).filter(Boolean).length;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!allPassed) {
      setError("Please meet all password requirements.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#fffdf3]">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#0a2744]/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-[#041523]/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-[#0f3a5f]/6 rounded-full blur-[120px] animate-pulse [animation-delay:4s]" />
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
        <div className="text-center mb-5 flex items-center justify-center gap-3">
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
                d="M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm6 2a2 2 0 100-4 2 2 0 000 4zm-6 7s-6-2.5-6-6h12c0 3.5-6 6-6 6zm8-1c2.21 0 4-1.343 4-3h-4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#041523] tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-[#041523]/50 mt-1">
              Start managing your tasks today
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="backdrop-blur-sm bg-[#041523]/3 border border-[#041523]/15 rounded-2xl p-6 pb-4 shadow-2xl shadow-[#041523]/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="register-email"
                className="block text-xs font-medium text-[#041523]/60 mb-1.5 uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="register-email"
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
              <label
                htmlFor="register-password"
                className="block text-xs font-medium text-[#041523]/60 mb-1.5 uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
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

              {/* Password strength indicators */}
              {password.length > 0 && (
                <div className="mt-3 space-y-2">
                  {/* Strength bar */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= passedCount
                            ? passedCount <= 1
                              ? "bg-red-500"
                              : passedCount <= 2
                                ? "bg-orange-500"
                                : passedCount <= 3
                                  ? "bg-yellow-500"
                                  : "bg-emerald-600"
                            : "bg-[#041523]/10"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Requirements checklist */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { key: "hasMinLength", label: "8+ characters" },
                      { key: "hasLowercase", label: "Lowercase letter" },
                      { key: "hasUppercase", label: "Uppercase letter" },
                      { key: "hasNumber", label: "Number" },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
                          passwordStrength[key as keyof PasswordStrength]
                            ? "text-emerald-700"
                            : "text-[#041523]/30"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            passwordStrength[key as keyof PasswordStrength]
                              ? "scale-100"
                              : "scale-90"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          {passwordStrength[key as keyof PasswordStrength] ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          ) : (
                            <circle cx="12" cy="12" r="9" />
                          )}
                        </svg>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-medium text-[#041523]/60 mb-1.5 uppercase tracking-wider">
                Role
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

            {/* Error / Success messages */}
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

            {success && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-sm">
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
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading || !allPassed}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                  loading || !allPassed
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
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#041523]/10" />
            <span className="text-xs text-[#041523]/40">or</span>
            <div className="flex-1 h-px bg-[#041523]/10" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-[#041523]/60">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#0a2744] hover:text-[#041523] font-medium transition-colors underline decoration-[#0a2744]/30 hover:decoration-[#041523]/50"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#041523]/30 mt-4">
          By creating an account, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}
