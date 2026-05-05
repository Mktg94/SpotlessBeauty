"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Registration failed"); return; }
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      toast.success("Account created! Welcome 🎉");
      router.push("/");
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 hero-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold gradient-text">Spotless Beauty Lab</Link>
          <h1 className="text-xl font-bold text-foreground mt-4 mb-1">Create your account</h1>
          <p className="text-muted text-sm">Start your skincare journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card space-y-4">
          <div>
            <label className="input-label" htmlFor="name">Full Name</label>
            <input id="name" type="text" className="input" required autoComplete="name"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="input-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" required autoComplete="email"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="input-label" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" type={showPw ? "text" : "password"} className="input pr-10" required minLength={6}
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted mt-1">Minimum 6 characters</p>
          </div>
          <button id="register-submit-btn" type="submit" className="btn-gold w-full py-3" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-gold hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
