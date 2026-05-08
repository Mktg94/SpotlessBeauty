import Link from "next/link";
import { MessageCircle, Send, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "var(--charcoal)", color: "white" }} className="mt-auto">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand — spans 2 cols on md */}
          <div className="col-span-2 md:col-span-2">
            <h2 className="text-xl font-bold gradient-text mb-3">Spotless Skin Lab</h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.55)", maxWidth: 260 }}>
              Authentic imported skincare, luxury bags &amp; accessories from USA &amp; Korea. Delivered across Ethiopia.
            </p>

            {/* Origin stamps */}
            <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem" }}>
              {["🇺🇸 Imported from USA", "🇰🇷 Imported from Korea"].map(s => (
                <span key={s} style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 99, padding: "4px 10px",
                  fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.65)",
                }}>{s}</span>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { icon: <MessageCircle size={15} />, label: "Telegram", href: "#" },
                { icon: <Send size={15} />, label: "Instagram", href: "#" },
                { icon: <Share2 size={15} />, label: "Facebook", href: "#" },
              ].map(s => (
                <a key={s.label} href={s.href} aria-label={s.label} className="footer-social-icon">{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Skincare */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.9)" }}>Skincare</h3>
            <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {["Moisturizers", "Serums", "Cleansers", "Sunscreens", "Eye Care", "Lip Care"].map(cat => (
                <li key={cat}>
                  <Link href="/products" className="transition-colors hover:text-white" style={{ color: "inherit", textDecoration: "none" }}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fashion */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.9)" }}>
              Fashion
              <span style={{
                marginLeft: 6, display: "inline-flex", alignItems: "center",
                background: "rgba(201,165,106,0.3)", color: "var(--gold-light)",
                fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.08em",
                padding: "1px 6px", borderRadius: 99, verticalAlign: "middle",
              }}>NEW</span>
            </h3>
            <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {["👜 Women Bags", "🧣 Luxury Scarfs"].map(cat => (
                <li key={cat}>
                  <Link href="/products" className="transition-colors hover:text-white" style={{ color: "inherit", textDecoration: "none" }}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.9)" }}>Help</h3>
            <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {[
                { label: "Track Order", href: "/orders" },
                { label: "Delivery Policy (Addis Ababa)", href: "#" },
                { label: "Authenticity Returns", href: "#" },
                { label: "Contact Us", href: "/contact" },
                { label: "FAQ", href: "#" },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-white" style={{ color: "inherit", textDecoration: "none" }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact */}
            <div style={{ marginTop: "1.25rem" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Contact</p>
              <ul className="space-y-1.5 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                <li>📍 Summit 20 Meter, Addis Ababa</li>
                <li>📞 +251 933 478 442</li>
                <li>✉️ semirahaile8485@gmail.com</li>
              </ul>
            </div>

            {/* Payment methods */}
            <div style={{ marginTop: "1.25rem" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>We Accept</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["📱 Telebirr", "💵 Cash on Delivery"].map(m => (
                  <span key={m} style={{
                    fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: 99,
                    background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}>{m}</span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
            © {new Date().getFullYear()} Spotless Skin Lab. All rights reserved.
          </p>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
            Made with 🌸 in Ethiopia &nbsp;·&nbsp; Authentic imports from 🇺🇸 USA &amp; 🇰🇷 Korea
          </p>
        </div>
      </div>
    </footer>
  );
}
