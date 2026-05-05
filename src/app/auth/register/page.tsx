"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Registration failed"); return; }
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      toast.success("Welcome to Spotless Beauty Lab! 🌸");
      router.push("/");
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
          <h1 className="text-4xl font-bold gradient-text mb-4">Join the Community</h1>
          <p className="text-lg mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>Unlock exclusive beauty deals</p>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>Get 10% off your first order 🎁</p>
          <div className="space-y-3 text-left">
            {["Access to exclusive deals & early launches", "Track all your orders in one place", "Leave reviews and earn rewards", "Free shipping on orders over 2,000 ETB"].map(b => (
              <div key={b} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                <span className="text-lg" style={{ color: "var(--gold)" }}>✦</span> {b}
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
            <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--charcoal)" }}>Create your account</h2>
            <p className="text-sm" style={{ color: "var(--stone)" }}>Start your skincare journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label" htmlFor="name">Full Name</label>
              <input id="name" type="text" className="input" required autoComplete="name"
                placeholder="Hana Tesfaye"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="input-label" htmlFor="email">Email Address</label>
              <input id="email" type="email" className="input" required autoComplete="email"
                placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="input-label" htmlFor="password">Password</label>
              <div className="relative">
                <input id="password" type={showPw ? "text" : "password"} className="input pr-10" required minLength={6}
                  placeholder="At least 6 characters"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--stone)", background: "none", border: "none", cursor: "pointer" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button id="register-submit-btn" type="submit" className="btn-primary w-full py-3 mt-2" disabled={loading}>
              {loading ? "Creating account…" : "Create Free Account"}
            </button>
            <p className="text-xs text-center" style={{ color: "var(--stone)" }}>
              By creating an account you agree to our Terms of Service
            </p>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--stone)" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "var(--rose)", fontWeight: 600, textDecoration: "none" }}
              className="hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
