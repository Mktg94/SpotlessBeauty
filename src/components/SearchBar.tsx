"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Clock, ArrowRight } from "lucide-react";
import { formatETB } from "@/lib/utils";

interface SearchProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  slug: string;
  brand?: string;
  category?: { name: string };
}

interface SearchBarProps {
  onClose: () => void;
}

const RECENT_KEY = "ssl_recent_searches";
const MAX_RECENT = 5;

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); } catch { return []; }
}

function saveRecent(term: string) {
  const prev = getRecent().filter(s => s !== term);
  localStorage.setItem(RECENT_KEY, JSON.stringify([term, ...prev].slice(0, MAX_RECENT)));
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setRecent(getRecent());
    inputRef.current?.focus();
    // Close on Escape
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const search = useCallback(async (term: string) => {
    if (!term.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(term)}&limit=6`);
      const data = await res.json();
      setResults(data.products ?? []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (term: string) => {
    saveRecent(term);
    onClose();
  };

  const clearRecent = () => {
    localStorage.removeItem(RECENT_KEY);
    setRecent([]);
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-box animate-scale-in" onClick={e => e.stopPropagation()}>
        {/* Input row */}
        <div className="search-input-wrap">
          <Search size={18} style={{ color: "var(--stone)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            id="search-input"
            placeholder="Search skincare, bags, scarfs…"
            value={query}
            onChange={e => handleChange(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--stone)", display: "flex" }}>
              <X size={16} />
            </button>
          )}
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--stone)", display: "flex" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--stone)" }}>ESC</span>
          </button>
        </div>

        {/* Results */}
        <div className="search-results">
          {loading && (
            <div style={{ padding: "1.5rem", display: "flex", justifyContent: "center" }}>
              <div className="spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="search-empty">
              <p style={{ marginBottom: 4 }}>No results for &ldquo;<strong>{query}</strong>&rdquo;</p>
              <p style={{ fontSize: "0.78rem" }}>Try a different term or browse all products</p>
              <Link href={`/products?search=${encodeURIComponent(query)}`} onClick={() => handleSelect(query)}
                className="btn-primary" style={{ marginTop: "0.75rem", fontSize: "0.82rem", padding: "0.5rem 1.2rem" }}>
                View All Results <ArrowRight size={13} />
              </Link>
            </div>
          )}

          {!loading && results.length > 0 && results.map(p => (
            <Link key={p._id} href={`/products/${p.slug}`}
              className="search-result-item"
              onClick={() => handleSelect(p.name)}>
              <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "var(--cream-deep)", position: "relative" }}>
                {p.images[0]
                  ? <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                  : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>🧴</span>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--charcoal)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                {p.category && <p style={{ fontSize: "0.72rem", color: "var(--stone)" }}>in {p.category.name}</p>}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--charcoal)" }}>{formatETB(p.discountPrice ?? p.price)}</p>
                {p.discountPrice && <p style={{ fontSize: "0.72rem", textDecoration: "line-through", color: "var(--stone)" }}>{formatETB(p.price)}</p>}
              </div>
            </Link>
          ))}

          {/* Recent searches */}
          {!query && recent.length > 0 && (
            <div style={{ padding: "0.75rem 1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--stone)" }}>Recent</p>
                <button onClick={clearRecent} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.72rem", color: "var(--stone)" }}>Clear</button>
              </div>
              {recent.map(r => (
                <button key={r} onClick={() => { setQuery(r); search(r); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", cursor: "pointer", padding: "0.4rem 0", fontFamily: "inherit" }}>
                  <Clock size={13} style={{ color: "var(--stone)" }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--slate)" }}>{r}</span>
                </button>
              ))}
            </div>
          )}

          {/* Browse all link when results exist */}
          {!loading && query && results.length > 0 && (
            <Link href={`/products?search=${encodeURIComponent(query)}`} onClick={() => handleSelect(query)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0.8rem", fontSize: "0.82rem", fontWeight: 600, color: "var(--rose)", textDecoration: "none", borderTop: "1px solid var(--border-soft)" }}>
              See all results for &ldquo;{query}&rdquo; <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
