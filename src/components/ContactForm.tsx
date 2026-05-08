"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate a small delay — in production you'd POST to an API route or email service
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--blush-light)", display: "flex", alignItems: "center", justifyContent: "center", marginInline: "auto", marginBottom: 16 }}>
          <CheckCircle size={28} style={{ color: "var(--rose)" }} />
        </div>
        <h3 style={{ fontWeight: 700, fontSize: "1.15rem", color: "var(--charcoal)", marginBottom: 8 }}>
          Message Received!
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--slate)", lineHeight: 1.65, maxWidth: 300, marginInline: "auto" }}>
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
          className="btn-ghost mt-6 text-sm"
          style={{ display: "inline-flex" }}>
          Send another message
        </button>
      </div>
    );
  }

  const field = (
    id: keyof FormState,
    label: string,
    type: string = "text",
    placeholder: string = "",
    required = false
  ) => (
    <div>
      <label className="input-label" htmlFor={`contact-${id}`}>
        {label}{required && <span style={{ color: "var(--rose)" }}> *</span>}
      </label>
      <input
        id={`contact-${id}`}
        className="input"
        type={type}
        placeholder={placeholder}
        required={required}
        value={form[id]}
        onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="grid sm:grid-cols-2 gap-4">
        {field("name", "Full Name", "text", "e.g. Hana Tesfaye", true)}
        {field("phone", "Phone / WhatsApp", "tel", "+251 9xx xxx xxx")}
      </div>
      {field("email", "Email Address", "email", "you@example.com")}

      <div>
        <label className="input-label" htmlFor="contact-subject">
          Subject <span style={{ color: "var(--rose)" }}>*</span>
        </label>
        <select id="contact-subject" className="input" required value={form.subject}
          onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
          <option value="">Select a subject</option>
          <option value="order">Order Inquiry</option>
          <option value="product">Product Question</option>
          <option value="authenticity">Authenticity Concern</option>
          <option value="delivery">Delivery Question</option>
          <option value="return">Return / Refund</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="input-label" htmlFor="contact-message">
          Message <span style={{ color: "var(--rose)" }}>*</span>
        </label>
        <textarea
          id="contact-message"
          className="input"
          style={{ minHeight: 120, resize: "vertical" }}
          placeholder="Tell us how we can help you…"
          required
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        />
      </div>

      <button
        id="contact-submit-btn"
        type="submit"
        className="btn-rose w-full flex items-center justify-center gap-2"
        disabled={loading}
        style={{ padding: "0.85rem" }}>
        {loading ? (
          <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Sending…</>
        ) : (
          <><Send size={15} /> Send Message</>
        )}
      </button>

      <p style={{ fontSize: "0.72rem", color: "var(--stone)", textAlign: "center" }}>
        Or reach us directly on WhatsApp at <strong>+251 933 478 442</strong>
      </p>
    </form>
  );
}
