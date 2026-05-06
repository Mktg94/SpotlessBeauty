"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (res?.error) { toast.error("Invalid email or password"); }
      else { toast.success("Welcome back! ✨"); router.push(next); router.refresh(); }
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen flex" style={{ background: "var(--cream)" }}>
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--charcoal) 0%, #3d2a2a 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 30% 40%, var(--blush) 0%, transparent 50%), radial-gradient(circle at 70% 70%, var(--gold) 0%, transparent 50%)"
        }} />
        <div className="relative text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4">Spotless Beauty Lab</h1>
          <p className="text-lg mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>Authentic Skincare from USA &amp; Korea</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Delivered to your door across Ethiopia 🇪🇹</p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {["🧴", "💆‍♀️", "✨", "🌸", "💎", "🇰🇷"].map((e, i) => (
              <div key={i} className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(4px)" }}>
                {e}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--blush-light)" }}>
              <Sparkles size={22} style={{ color: "var(--rose)" }} />
            </div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--charcoal)" }}>Welcome back</h2>
            <p className="text-sm" style={{ color: "var(--stone)" }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label" htmlFor="email">Email Address</label>
              <input id="email" type="email" className="input" required autoComplete="email"
                placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="input-label" htmlFor="password">Password</label>
                <a href="#" className="text-xs hover:underline" style={{ color: "var(--rose)" }}>Forgot password?</a>
              </div>
              <div className="relative">
                <input id="password" type={showPw ? "text" : "password"} className="input pr-10" required
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--stone)", background: "none", border: "none", cursor: "pointer" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button id="login-submit-btn" type="submit" className="btn-primary w-full py-3 mt-2" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--stone)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" style={{ color: "var(--rose)", fontWeight: 600, textDecoration: "none" }}
              className="hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <div className="spinner" />
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
