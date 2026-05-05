"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
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
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push(next);
        router.refresh();
      }
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 hero-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold gradient-text">Spotless Beauty Lab</Link>
          <h1 className="text-xl font-bold text-foreground mt-4 mb-1">Welcome back</h1>
          <p className="text-muted text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card space-y-4">
          <div>
            <label className="input-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" required autoComplete="email"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="input-label" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" type={showPw ? "text" : "password"} className="input pr-10" required
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button id="login-submit-btn" type="submit" className="btn-gold w-full py-3" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
          <p className="text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-gold hover:underline">Create one</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
