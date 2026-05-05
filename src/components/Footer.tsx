import Link from "next/link";
import { Globe, MessageCircle, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-deep border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold gradient-text mb-3">Spotless Beauty Lab</h2>
            <p className="text-sm text-muted leading-relaxed">
              Premium imported skincare & beauty products delivered across Ethiopia.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="icon-btn" aria-label="Website"><Globe size={18} /></a>
              <a href="#" className="icon-btn" aria-label="Telegram"><MessageCircle size={18} /></a>
              <a href="#" className="icon-btn" aria-label="Share"><Share2 size={18} /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2 text-sm text-muted">
              {["Moisturizers", "Serums", "Cleansers", "Sunscreens", "Eye Care", "Lip Care"].map((cat) => (
                <li key={cat}>
                  <Link href={`/products?category=${cat.toLowerCase().replace(/ /g, "-")}`} className="hover:text-gold transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Help</h3>
            <ul className="space-y-2 text-sm text-muted">
              {[
                { label: "FAQ", href: "#" },
                { label: "Shipping Policy", href: "#" },
                { label: "Returns", href: "#" },
                { label: "Contact Us", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-gold transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>📍 Bole, Addis Ababa, Ethiopia</li>
              <li>📞 +251 911 000 000</li>
              <li>✉️ hello@spotlessbeautylab.com</li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-muted mb-2">We accept</p>
              <div className="flex gap-2 flex-wrap">
                <span className="payment-badge">Telebirr</span>
                <span className="payment-badge">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-muted">
          <p>© {new Date().getFullYear()} Spotless Beauty Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
