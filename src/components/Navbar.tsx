"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/components/providers/CartProvider";
import { ShoppingBag, Menu, X, Search, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
  ];

  return (
    <header className="navbar-glass sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold gradient-text">Spotless Beauty</span>
          <span className="text-xs text-gold/70 font-medium tracking-widest uppercase hidden sm:block">Lab</span>
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

          {session ? (
            <div className="relative group hidden md:block">
              <button className="icon-btn" aria-label="Account">
                <User size={20} />
              </button>
              <div className="dropdown">
                {session.user?.role === "admin" && (
                  <Link href="/admin" className="dropdown-item">
                    <LayoutDashboard size={14} />
                    Admin Panel
                  </Link>
                )}
                <Link href="/orders" className="dropdown-item">
                  <ShoppingBag size={14} />
                  My Orders
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="dropdown-item text-red-400"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth/login" className="btn-gold hidden md:flex">
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
        <div className="md:hidden border-t border-white/10 bg-navy/95 backdrop-blur-xl px-4 py-4 space-y-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2 nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {session ? (
            <>
              {session.user?.role === "admin" && (
                <Link href="/admin" className="block py-2 nav-link" onClick={() => setMenuOpen(false)}>
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                className="block py-2 text-red-400 text-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="btn-gold w-full text-center block" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
