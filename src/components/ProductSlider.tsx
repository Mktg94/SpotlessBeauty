"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { formatETB } from "@/lib/utils";
import toast from "react-hot-toast";

interface SliderProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  slug: string;
  brand?: string;
  stock: number;
  rating: number;
  numReviews: number;
}

interface ProductSliderProps {
  title: string;
  subtitle?: string;
  apiQuery: string;       // e.g. "?featured=true&limit=10"
  viewAllHref?: string;
  accentColor?: "rose" | "gold";
  badge?: string;         // optional badge label e.g. "✨ NEW"
}

export default function ProductSlider({
  title,
  subtitle,
  apiQuery,
  viewAllHref = "/products",
  accentColor = "rose",
  badge,
}: ProductSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<SliderProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const { addItem } = useCart();

  const accent = accentColor === "gold" ? "var(--gold)" : "var(--rose)";

  useEffect(() => {
    fetch(`/api/products${apiQuery}`)
      .then(r => r.json())
      .then(d => { setProducts(d.products ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [apiQuery]);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();
    return () => el.removeEventListener("scroll", updateArrows);
  }, [updateArrows, products]);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -480 : 480, behavior: "smooth" });
  };

  if (!loading && products.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          {badge && <span className="fashion-badge" style={{ marginBottom: 6, display: "inline-flex" }}>{badge}</span>}
          <h2 className="section-title" style={{ fontSize: "clamp(1.3rem,3vw,1.9rem)" }}>{title}</h2>
          {subtitle && <p style={{ fontSize: "0.875rem", color: "var(--stone)", marginTop: 2 }}>{subtitle}</p>}
          <div className="section-divider" style={{ marginTop: 8 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, paddingBottom: 4 }}>
          <button onClick={() => scroll("left")} disabled={!canLeft} className="slider-arrow" aria-label="Previous">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll("right")} disabled={!canRight} className="slider-arrow" aria-label="Next">
            <ChevronRight size={16} />
          </button>
          <Link href={viewAllHref} className="btn-ghost" style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 4 }}>
            View All <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Track */}
      <div ref={trackRef} className="slider-track">
        {loading
          ? [...Array(5)].map((_, i) => (
              <div key={i} style={{ width: 220, flexShrink: 0 }}>
                <div className="skeleton" style={{ aspectRatio: "1", borderRadius: "var(--radius-md)", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, borderRadius: 6, marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 14, width: "60%", borderRadius: 6 }} />
              </div>
            ))
          : products.map(p => {
              const displayPrice = p.discountPrice ?? p.price;
              const hasDiscount = p.discountPrice && p.discountPrice < p.price;
              const discount = hasDiscount ? Math.round(((p.price - p.discountPrice!) / p.price) * 100) : 0;

              return (
                <div key={p._id} className="product-card" style={{ width: 220 }}>
                  <Link href={`/products/${p.slug}`} style={{ textDecoration: "none", display: "contents" }}>
                    <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden", background: "var(--cream-deep)" }}>
                      {p.images[0]
                        ? <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="220px"
                            style={{ transition: "transform 0.5s", transformOrigin: "center" }}
                            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                        : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 32 }}>🧴</div>
                      }
                      {hasDiscount && (
                        <span className="badge-discount" style={{ position: "absolute", top: 8, left: 8 }}>-{discount}%</span>
                      )}
                      {p.stock === 0 && (
                        <span className="badge-out-stock" style={{ position: "absolute", top: 8, left: 8 }}>Out of Stock</span>
                      )}
                    </div>
                  </Link>

                  <div style={{ padding: "0.6rem 0.75rem", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                    {p.brand && <p style={{ fontSize: "0.68rem", fontWeight: 700, color: accent, letterSpacing: "0.04em" }}>{p.brand}</p>}
                    <Link href={`/products/${p.slug}`} style={{ textDecoration: "none" }}>
                      <h3 style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--charcoal)", lineHeight: 1.35,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {p.name}
                      </h3>
                    </Link>

                    {/* Stars */}
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10}
                          style={i < Math.round(p.rating) ? { fill: "var(--gold)", color: "var(--gold)" } : { color: "var(--cream-deep)" }} />
                      ))}
                      <span style={{ fontSize: "0.65rem", color: "var(--stone)" }}>({p.numReviews})</span>
                    </div>

                    {/* Price */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--charcoal)" }}>{formatETB(displayPrice)}</span>
                      {hasDiscount && <span style={{ fontSize: "0.72rem", textDecoration: "line-through", color: "var(--stone)" }}>{formatETB(p.price)}</span>}
                    </div>

                    {/* Add to cart */}
                    <button
                      id={`slider-cart-${p._id}`}
                      disabled={p.stock === 0}
                      onClick={() => {
                        addItem({ id: p._id, name: p.name, price: displayPrice, image: p.images[0] ?? "", quantity: 1, stock: p.stock });
                        toast.success(`${p.name} added to cart!`);
                      }}
                      className="btn-cart"
                      style={{ marginTop: 6 }}
                    >
                      <ShoppingCart size={12} />
                      {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })
        }
      </div>
    </div>
  );
}
