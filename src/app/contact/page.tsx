import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Spotless Skin Lab. We're here to help with your skincare and fashion accessory questions.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ background: "var(--cream)" }}>

        {/* ── HERO BANNER ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-16 md:py-20"
          style={{ background: "linear-gradient(135deg, var(--charcoal) 0%, #3d2a2a 100%)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "var(--blush)", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: "var(--gold)", transform: "translate(-30%,30%)" }} />
          <div className="container mx-auto px-4 text-center" style={{ position: "relative" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)",
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "6px 18px", borderRadius: 99, marginBottom: 16,
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              🌸 We&apos;re here to help
            </span>
            <h1 className="section-title" style={{ color: "white", fontSize: "clamp(1.8rem,5vw,2.8rem)" }}>
              Contact Us
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: 440, marginInline: "auto", marginTop: 12, lineHeight: 1.7 }}>
              Have a question about a product, your order, or anything else? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <section className="section">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-start">

              {/* ── LEFT: Info cards ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                {/* Visit us */}
                <div className="glass-card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div className="trust-icon-wrap" style={{ flexShrink: 0 }}>
                    <MapPin size={18} style={{ color: "var(--rose)" }} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: "var(--charcoal)", marginBottom: 4 }}>Visit Us</h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--slate)", lineHeight: 1.6 }}>
                      Summit 20 Meter, Near Zemen Bank<br />Addis Ababa, Ethiopia
                    </p>
                    <a
                      href="https://maps.app.goo.gl/VHPnqkocd4QMrVfA6"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "0.78rem", color: "var(--rose)", textDecoration: "none", marginTop: 4, display: "inline-block", fontWeight: 600 }}>
                      Open in Google Maps →
                    </a>
                  </div>
                </div>

                {/* Call us */}
                <div className="glass-card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div className="trust-icon-wrap" style={{ flexShrink: 0 }}>
                    <Phone size={18} style={{ color: "var(--rose)" }} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: "var(--charcoal)", marginBottom: 4 }}>Call / WhatsApp</h3>
                    <a href="tel:+251933478442" style={{ fontSize: "0.875rem", color: "var(--slate)", textDecoration: "none" }}>
                      +251 933 478 442
                    </a>
                    <p style={{ fontSize: "0.78rem", color: "var(--stone)", marginTop: 4 }}>
                      Available on WhatsApp for quick replies
                    </p>
                  </div>
                </div>

                {/* Email us */}
                <div className="glass-card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div className="trust-icon-wrap" style={{ flexShrink: 0 }}>
                    <Mail size={18} style={{ color: "var(--rose)" }} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: "var(--charcoal)", marginBottom: 4 }}>Email Us</h3>
                    <a href="mailto:semirahaile8485@gmail.com"
                      style={{ fontSize: "0.875rem", color: "var(--slate)", textDecoration: "none" }}>
                      semirahaile8485@gmail.com
                    </a>
                    <p style={{ fontSize: "0.78rem", color: "var(--stone)", marginTop: 4 }}>
                      We reply within 24 hours
                    </p>
                  </div>
                </div>

                {/* Business hours */}
                <div className="glass-card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div className="trust-icon-wrap" style={{ flexShrink: 0 }}>
                    <Clock size={18} style={{ color: "var(--rose)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, color: "var(--charcoal)", marginBottom: 8 }}>Business Hours</h3>
                    {[
                      { day: "Monday – Friday", hours: "9:00 AM – 6:00 PM" },
                      { day: "Saturday", hours: "10:00 AM – 4:00 PM" },
                      { day: "Sunday", hours: "Closed" },
                    ].map(r => (
                      <div key={r.day} style={{ display: "flex", justifyContent: "space-between", paddingBlock: 4, borderBottom: "1px solid var(--border-soft)", fontSize: "0.82rem" }}>
                        <span style={{ color: "var(--slate)" }}>{r.day}</span>
                        <span style={{ fontWeight: 600, color: r.hours === "Closed" ? "var(--stone)" : "var(--charcoal)" }}>{r.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Telegram quick link */}
                <a href="https://t.me/spotlesssolutions22"
                  target="_blank" rel="noopener noreferrer"
                  className="btn-rose flex items-center justify-center gap-2"
                  style={{ textDecoration: "none", width: "100%" }}>
                  <MessageCircle size={16} />
                  Chat on Telegram
                </a>
              </div>

              {/* ── RIGHT: Contact form ── */}
              <div>
                <div className="glass-card">
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--charcoal)" }}>Send Us a Message</h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--stone)", marginTop: 4 }}>
                      Fill in the form below and we&apos;ll get back to you as soon as possible.
                    </p>
                    <div className="section-divider" style={{ marginTop: 12 }} />
                  </div>
                  <ContactForm />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── FAQ STRIP ────────────────────────────────────────────── */}
        <section className="section" style={{ background: "var(--cream-deep)" }}>
          <div className="container mx-auto px-4">
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <div className="section-divider mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-5" style={{ maxWidth: 800, marginInline: "auto" }}>
              {[
                { q: "Are your products 100% authentic?", a: "Yes — all products are imported directly from the USA and Korea. We provide authenticity guarantees on every order." },
                { q: "What if my product is not genuine?", a: "We have an Authenticity Guarantee. If you believe your product is not genuine, contact us immediately and we will resolve it." },
                { q: "Do you deliver outside Addis Ababa?", a: "Currently we deliver within Addis Ababa. We are working to expand delivery to other cities soon." },
                { q: "What payment methods do you accept?", a: "We accept Telebirr and Cash on Delivery. We do not accept opened product returns, only authenticity-related concerns." },
                { q: "How long does delivery take?", a: "Orders within Addis Ababa are typically delivered within 1–3 business days." },
                { q: "How do I track my order?", a: "After placing an order, you can track it from My Orders page in your account dashboard." },
              ].map(faq => (
                <div key={faq.q} className="glass-card" style={{ padding: "1rem 1.25rem" }}>
                  <p style={{ fontWeight: 700, color: "var(--charcoal)", fontSize: "0.875rem", marginBottom: 6 }}>
                    {faq.q}
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "var(--slate)", lineHeight: 1.65 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
