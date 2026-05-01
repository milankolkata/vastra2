"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shirt, Loader2, AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const isNewAccount = searchParams.get("new") === "1";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/dashboard");
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setError("Supabase is not configured. Add environment variables to enable auth.");
      return;
    }
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Incorrect email or password. Please try again."
          : authError.message
      );
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-amber-500 rounded-lg flex items-center justify-center shadow-sm">
            <Shirt className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-[15px]">Vastra AI</span>
        </Link>
        <Link
          href="/register"
          className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
        >
          Create account
        </Link>
      </nav>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="mb-8 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
              <p className="text-slate-500 text-sm mt-1.5">Sign in to your Vastra AI account</p>
            </div>

            {isNewAccount && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-700 flex gap-2 items-start">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                <div>
                  <p className="font-semibold">Account created!</p>
                  <p className="text-emerald-600 mt-0.5 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Check your email to verify, then sign in below.
                  </p>
                </div>
              </div>
            )}

            {!supabase && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700 flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Auth not configured.{" "}
                  <Link href="/dashboard" className="font-semibold underline">
                    Continue to demo
                  </Link>
                </span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="label-text">Email address</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="password" className="label-text">Password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-sm mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-violet-600 hover:text-violet-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
