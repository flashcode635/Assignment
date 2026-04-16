import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffdf3] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#041523]/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0a2744]/8 rounded-full blur-[140px] animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative z-10 text-center px-4">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-[#041523] to-[#0a2744] mb-6 shadow-xl shadow-[#041523]/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-[#fffdf3]"
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
        </div>

        <h1 className="text-4xl font-bold text-[#041523] tracking-tight mb-3">
          Task Manager
        </h1>
        <p className="text-[#041523]/60 text-lg mb-10 max-w-md mx-auto">
          A simple, secure way to manage your tasks with role-based
          authentication.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="px-8 py-3 rounded-xl bg-linear-to-r from-[#041523] to-[#0a2744] text-[#fffdf3] text-sm font-semibold
              hover:shadow-lg hover:shadow-[#041523]/20 hover:-translate-y-0.5 active:translate-y-0
              transition-all duration-200 w-full sm:w-auto text-center"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 rounded-xl bg-[#041523]/5 border border-[#041523]/15 text-[#041523] text-sm font-semibold
              hover:bg-[#041523]/10 hover:border-[#041523]/25 hover:-translate-y-0.5 active:translate-y-0
              transition-all duration-200 w-full sm:w-auto text-center"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
