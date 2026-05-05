import Link from "next/link";
import { Globe, MessageCircle, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "var(--charcoal)", color: "white" }} className="mt-auto">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold gradient-text mb-3">Spotless Beauty Lab</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Authentic imported skincare &amp; beauty products from USA &amp; Korea. Delivered across Ethiopia.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: <Globe size={16} />, label: "Website" },
                { icon: <MessageCircle size={16} />, label: "Telegram" },
                { icon: <Share2 size={16} />, label: "Share" },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="footer-social-icon">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.9)" }}>Shop</h3>
            <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {["Moisturizers", "Serums", "Cleansers", "Sunscreens", "Eye Care", "Lip Care"].map((cat) => (
                <li key={cat}>
                  <Link href="/products" className="transition-colors hover:text-white"
                    style={{ color: "inherit", textDecoration: "none" }}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.9)" }}>Help</h3>
            <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {[
                { label: "FAQ", href: "#" },
                { label: "Shipping Policy", href: "#" },
                { label: "Returns & Refunds", href: "#" },
                { label: "Contact Us", href: "#" },
                { label: "Track Order", href: "/orders" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-white"
                    style={{ color: "inherit", textDecoration: "none" }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.9)" }}>Contact</h3>
            <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              <li>📍 Summit 20 Meter, Addis Ababa, Ethiopia</li>
              <li>📞 +251 933 478 442</li>
              <li>✉️ semirahaile8485@.com</li>
            </ul>
            <div className="mt-5">
              <p className="text-xs mb-2.5" style={{ color: "rgba(255,255,255,0.4)" }}>We Accept</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                  Telebirr
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                  Cash on Delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }}>
          <p>© {new Date().getFullYear()} Spotless Beauty Lab. All rights reserved.</p>
          <p>Made with 🌸 in Ethiopia &nbsp;·&nbsp; Authentic imports from 🇺🇸 USA &amp; 🇰🇷 Korea</p>
        </div>
      </div>
    </footer>
  );
}
