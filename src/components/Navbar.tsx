"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/components/providers/CartProvider";
import { ShoppingBag, Search, User, LogOut, LayoutDashboard, X, Menu, ShoppingCart } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
  ];

  return (
    <header className="navbar-glass sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold gradient-text">Spotless Skin</span>
          <span className="text-xs font-medium tracking-widest uppercase hidden sm:block" style={{ color: "var(--stone)" }}>Lab</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link href="/products?search=1" className="icon-btn" aria-label="Search">
            <Search size={20} />
          </Link>

          <Link href="/cart" className="icon-btn relative" aria-label="Cart">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems > 9 ? "9+" : totalItems}</span>
            )}
          </Link>

          {/* User dropdown — click based, no hover gap issue */}
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

          {/* Mobile menu toggle — ONLY on mobile */}
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
        <div className="md:hidden border-t px-4 py-4 space-y-2" style={{ borderColor: "var(--border-soft)", background: "white" }}>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2.5 text-sm font-medium nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ height: 1, background: "var(--border-soft)", margin: "8px 0" }} />
          {session ? (
            <>
              <p className="text-xs font-semibold py-1" style={{ color: "var(--stone)" }}>
                {session.user?.name}
              </p>
              {session.user?.role === "admin" && (
                <Link href="/admin" className="block py-2.5 text-sm font-medium nav-link" onClick={() => setMenuOpen(false)}>
                  Admin Panel
                </Link>
              )}
              <Link href="/orders" className="block py-2.5 text-sm font-medium nav-link" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>
              <button
                onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                className="block py-2.5 text-sm font-medium w-full text-left"
                style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="btn-primary w-full text-center block" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
