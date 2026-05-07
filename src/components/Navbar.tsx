"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/components/providers/CartProvider";
import {
  ShoppingBag, Search, User, LogOut, LayoutDashboard,
  X, Menu, ShoppingCart, ChevronDown, Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const SearchBar = dynamic(() => import("@/components/SearchBar"), { ssr: false });

// ── Mega-menu data ────────────────────────────────────────────────────────────
const SKINCARE_LINKS = [
  { label: "Moisturizers", href: "/products?search=moisturizer", emoji: "💧" },
  { label: "Serums", href: "/products?search=serum", emoji: "✨" },
  { label: "Cleansers", href: "/products?search=cleanser", emoji: "🧼" },
  { label: "Sunscreens", href: "/products?search=sunscreen", emoji: "☀️" },
  { label: "Eye Care", href: "/products?search=eye", emoji: "👁️" },
  { label: "Lip Care", href: "/products?search=lip", emoji: "💄" },
];

const FASHION_LINKS = [
  { label: "Women Bags", href: "/products?search=bag", emoji: "👜" },
  { label: "Luxury Scarfs", href: "/products?search=scarf", emoji: "🧣" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click-outside for user dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className="navbar-glass sticky top-0 z-50"
        style={{ boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.08)" : undefined, transition: "box-shadow 0.3s" }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold gradient-text">Spotless Skin</span>
            <span className="text-xs font-medium tracking-widest uppercase hidden sm:block" style={{ color: "var(--stone)" }}>Lab</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3">
            <Link href="/" className="nav-link px-4 py-2 rounded-lg hover:bg-cream-deep transition-colors">Home</Link>

            {/* Shop mega-menu trigger */}
            <div className="relative" ref={megaRef}>
              <button
                id="shop-menu-btn"
                onClick={() => setMegaOpen(o => !o)}
                className="nav-link px-4 py-2 rounded-lg hover:bg-cream-deep transition-colors flex items-center gap-1"
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                Shop
                <ChevronDown size={13} style={{ transition: "transform 0.2s", transform: megaOpen ? "rotate(180deg)" : "none" }} />
              </button>

              {/* Mega menu */}
              <div className={`mega-menu ${megaOpen ? "mega-menu-open" : ""} animate-slide-down`}>
                {/* Skincare column */}
                <div style={{ minWidth: 160 }}>
                  <p className="mega-col-title">🌿 Korean Skincare</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {SKINCARE_LINKS.map(l => (
                      <Link key={l.href} href={l.href} className="mega-link" onClick={() => setMegaOpen(false)}>
                        <span>{l.emoji}</span> {l.label}
                      </Link>
                    ))}
                    <Link href="/products" className="mega-link" style={{ marginTop: 4, color: "var(--rose)", fontWeight: 600 }}
                      onClick={() => setMegaOpen(false)}>
                      View all Skincare →
                    </Link>
                  </div>
                </div>

                {/* Fashion column */}
                <div style={{ minWidth: 160, borderLeft: "1px solid var(--border-soft)", paddingLeft: "1.25rem" }}>
                  <p className="mega-col-title" style={{ color: "var(--gold)" }}>👜 Fashion Accessories</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {FASHION_LINKS.map(l => (
                      <Link key={l.href} href={l.href} className="mega-link" onClick={() => setMegaOpen(false)}>
                        <span>{l.emoji}</span> {l.label}
                      </Link>
                    ))}
                  </div>
                  <div style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "var(--radius-md)", background: "var(--cream-deep)" }}>
                    <div className="fashion-badge" style={{ marginBottom: 6 }}>
                      <Sparkles size={10} /> New Arrivals
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--slate)", lineHeight: 1.4 }}>
                      Luxury bags & scarfs — imported for you
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/products?featured=true" className="nav-link px-4 py-2 rounded-lg hover:bg-cream-deep transition-colors">Best Sellers</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              id="search-btn"
              onClick={() => setSearchOpen(true)}
              className="icon-btn"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link href="/cart" className="icon-btn relative" aria-label="Cart">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems > 9 ? "9+" : totalItems}</span>
              )}
            </Link>

            {/* User dropdown */}
            {session ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  id="user-menu-btn"
                  className="icon-btn"
                  aria-label="Account"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <User size={20} />
                </button>

                {dropdownOpen && (
                  <div className="dropdown" style={{ display: "flex" }} onClick={() => setDropdownOpen(false)}>
                    <div className="px-3 py-2 border-b" style={{ borderColor: "var(--border-soft)" }}>
                      <p className="text-xs font-semibold" style={{ color: "var(--charcoal)" }}>{session.user?.name}</p>
                      <p className="text-xs" style={{ color: "var(--stone)" }}>{session.user?.email}</p>
                    </div>
                    {session.user?.role === "admin" && (
                      <Link href="/admin" className="dropdown-item">
                        <LayoutDashboard size={14} /> Admin Panel
                      </Link>
                    )}
                    <Link href="/orders" className="dropdown-item">
                      <ShoppingCart size={14} /> My Orders
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="dropdown-item"
                      style={{ color: "#dc2626" }}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="btn-primary hidden md:flex text-sm px-4 py-2">
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="icon-btn md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t px-4 py-4 animate-slide-down"
            style={{ borderColor: "var(--border-soft)", background: "white" }}>
            <Link href="/" className="block py-2.5 text-sm font-medium nav-link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            {/* Mobile shop links */}
            <div style={{ marginTop: 4 }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--rose)", padding: "8px 0 4px" }}>
                Korean Skincare
              </p>
              {SKINCARE_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="block py-2 text-sm nav-link pl-2" onClick={() => setMenuOpen(false)}>
                  {l.emoji} {l.label}
                </Link>
              ))}
            </div>

            <div style={{ marginTop: 8 }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gold)", padding: "8px 0 4px" }}>
                Fashion Accessories
              </p>
              {FASHION_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="block py-2 text-sm nav-link pl-2" onClick={() => setMenuOpen(false)}>
                  {l.emoji} {l.label}
                </Link>
              ))}
            </div>

            <Link href="/products?featured=true" className="block py-2.5 text-sm font-medium nav-link mt-2" onClick={() => setMenuOpen(false)}>
              ⭐ Best Sellers
            </Link>

            <div style={{ height: 1, background: "var(--border-soft)", margin: "10px 0" }} />

            {session ? (
              <>
                <p className="text-xs font-semibold py-1" style={{ color: "var(--stone)" }}>{session.user?.name}</p>
                {session.user?.role === "admin" && (
                  <Link href="/admin" className="block py-2.5 text-sm font-medium nav-link" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                )}
                <Link href="/orders" className="block py-2.5 text-sm font-medium nav-link" onClick={() => setMenuOpen(false)}>My Orders</Link>
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                  className="block py-2.5 text-sm font-medium w-full text-left"
                  style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="btn-primary w-full text-center block mt-2" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Search overlay */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </>
  );
}
