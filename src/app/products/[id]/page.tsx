"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/providers/CartProvider";
import { formatETB, getStars } from "@/lib/utils";
import {
  ShoppingCart, Star, Minus, Plus, ArrowLeft, Zap,
  CheckCircle, Send, Shield, Truck, Package,
} from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  _id: string; name: string; price: number; discountPrice?: number;
  images: string[]; rating: number; numReviews: number; brand?: string;
  stock: number; slug: string; description: string; ingredients?: string; usage?: string;
  skinType?: string[];
  category?: { _id: string; name: string; slug: string };
}

interface Review {
  _id: string; name: string; rating: number; comment: string; createdAt: string;
  user?: { _id: string };
}

type Tab = "description" | "ingredients" | "usage";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setLoading(false); return; }
        setProduct(data);
        setLoading(false);
        if (data.category?._id) {
          fetch(`/api/products?category=${data.category._id}&limit=5`)
            .then(r => r.json())
            .then(d => setRelated((d.products ?? []).filter((p: Product) => p._id !== data._id)));
        }
      })
      .catch(() => setLoading(false));

    fetch(`/api/reviews?product=${id}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setReviews(data); })
      .catch(() => {});
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ id: product._id, name: product.name, price: displayPrice, image: product.images[0] ?? "", quantity: qty, stock: product.stock });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => { handleAddToCart(); router.push("/checkout"); };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { toast.error("Sign in to leave a review"); return; }
    if (!reviewForm.comment.trim()) { toast.error("Please write a comment"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: id, rating: reviewForm.rating, comment: reviewForm.comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setReviews(prev => [data, ...prev]);
      setReviewForm({ rating: 5, comment: "" });
      toast.success("Review submitted!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    } finally { setSubmitting(false); }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-8 rounded-lg" />)}</div>
        </div>
      </main>
      <Footer />
    </>
  );

  if (!product) return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-32">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <h2 className="text-xl font-bold mb-4">Product Not Found</h2>
          <Link href="/products" className="btn-primary mt-4">Back to Shop</Link>
        </div>
      </main>
      <Footer />
    </>
  );

  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discount = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;
  const stars = getStars(product.rating);
  const tabs: { key: Tab; label: string }[] = [
    { key: "description", label: "Description" },
    ...(product.ingredients ? [{ key: "ingredients" as Tab, label: "Ingredients" }] : []),
    ...(product.usage ? [{ key: "usage" as Tab, label: "How to Use" }] : []),
  ];

  // Review summary bars
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ background: "var(--cream)", paddingBottom: "5rem" }}>
        <div className="container mx-auto px-4 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--stone)" }}>
            <Link href="/" style={{ color: "var(--stone)", textDecoration: "none" }} className="hover:text-rose transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" style={{ color: "var(--stone)", textDecoration: "none" }} className="hover:text-rose transition-colors">Shop</Link>
            {product.category && <>
              <span>/</span>
              <Link href={`/products?category=${product.category._id}`} style={{ color: "var(--stone)", textDecoration: "none" }} className="hover:text-rose transition-colors">{product.category.name}</Link>
            </>}
            <span>/</span>
            <span style={{ color: "var(--charcoal)", fontWeight: 500 }}>{product.name}</span>
          </nav>

          {/* Back button on mobile */}
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-sm mb-4 md:hidden"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontFamily: "inherit" }}>
            <ArrowLeft size={14} /> Back
          </button>

          {/* ── Product Main ────────────────────────────────────────── */}
          <div className="grid md:grid-cols-2 gap-10 mb-16">

            {/* Image Gallery */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Main image */}
              <div className="gallery-main aspect-square">
                {product.images[activeImg] ? (
                  <Image
                    src={product.images[activeImg]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 64, background: "var(--cream-deep)" }}>🧴</div>
                )}
                {hasDiscount && <span className="badge-discount" style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>-{discount}% OFF</span>}
                {product.stock === 0 && <span className="badge-out-stock" style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>Out of Stock</span>}
              </div>

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="gallery-thumb-strip">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`gallery-thumb ${activeImg === i ? "active" : ""}`}
                      aria-label={`Image ${i + 1}`}
                      style={{ background: "none", padding: 0 }}>
                      <Image src={img} alt={`view ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Brand & category */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.brand && (
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--rose)" }}>{product.brand}</span>
                )}
                {product.category && (
                  <Link href={`/products?category=${product.category._id}`}
                    style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--stone)", textDecoration: "none", background: "var(--cream-deep)", padding: "2px 10px", borderRadius: 99 }}>
                    {product.category.name}
                  </Link>
                )}
              </div>

              <h1 style={{ fontSize: "clamp(1.4rem,3.5vw,2rem)", fontWeight: 700, lineHeight: 1.2, color: "var(--charcoal)" }}>{product.name}</h1>

              {/* Rating row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {stars.map((s, i) => (
                    <Star key={i} size={15}
                      style={s === "full" ? { fill: "var(--gold)", color: "var(--gold)" }
                        : s === "half" ? { fill: "var(--gold-light)", color: "var(--gold)" }
                        : { color: "var(--cream-deep)" }} />
                  ))}
                </div>
                <span style={{ fontSize: "0.82rem", color: "var(--stone)" }}>
                  {product.rating.toFixed(1)} ({product.numReviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "0.75rem 0", borderTop: "1px solid var(--border-soft)", borderBottom: "1px solid var(--border-soft)" }}>
                <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--charcoal)" }}>{formatETB(displayPrice)}</span>
                {hasDiscount && <>
                  <span style={{ fontSize: "1.1rem", textDecoration: "line-through", color: "var(--stone)" }}>{formatETB(product.price)}</span>
                  <span className="badge-discount">Save {discount}%</span>
                </>}
              </div>

              {/* Stock status */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {product.stock > 10 ? (
                  <><CheckCircle size={15} style={{ color: "#16a34a" }} /><span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#16a34a" }}>In Stock</span></>
                ) : product.stock > 0 ? (
                  <><CheckCircle size={15} style={{ color: "#d97706" }} /><span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#d97706" }}>Only {product.stock} left</span></>
                ) : (
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#dc2626" }}>Out of Stock</span>
                )}
              </div>

              {/* Qty + Actions (desktop) */}
              {product.stock > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Quantity selector */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--slate)" }}>Qty</span>
                    <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--border-soft)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                      <button id="qty-minus" onClick={() => setQty(q => Math.max(1, q - 1))}
                        style={{ width: 40, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "var(--slate)" }}>
                        <Minus size={14} />
                      </button>
                      <span style={{ width: 44, textAlign: "center", fontWeight: 700, color: "var(--charcoal)", borderLeft: "1px solid var(--border-soft)", borderRight: "1px solid var(--border-soft)", lineHeight: "44px" }}>{qty}</span>
                      <button id="qty-plus" onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                        style={{ width: 40, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "var(--slate)" }}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* CTA buttons (hidden on mobile — shown in sticky bar) */}
                  <div style={{ display: "flex", gap: 10 }} className="hidden md:flex">
                    <button id="add-to-cart-btn" onClick={handleAddToCart} className="btn-outline flex-1 py-3 flex items-center justify-center gap-2">
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                    <button id="buy-now-btn" onClick={handleBuyNow} className="btn-rose flex-1 py-3 flex items-center justify-center gap-2">
                      <Zap size={16} /> Buy Now
                    </button>
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div style={{ padding: "0.875rem 1rem", background: "var(--cream-deep)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: <Shield size={13} />, text: "100% Authentic — imported & verified" },
                  { icon: <Truck size={13} />, text: "Free delivery on orders over 20,000 ETB (Addis Ababa)" },
                  { icon: <Shield size={13} />, text: "Authenticity Guarantee — return if not genuine" },
                  { icon: <Package size={13} />, text: "Secure checkout — Telebirr & Cash on Delivery" },
                ].map(t => (
                  <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "var(--slate)" }}>
                    <span style={{ color: "var(--rose)", flexShrink: 0 }}>{t.icon}</span> {t.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tabs ────────────────────────────────────────────────── */}
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border-soft)", marginBottom: "1.5rem" }}>
              {tabs.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    borderBottom: tab === t.key ? "2px solid var(--rose)" : "2px solid transparent",
                    color: tab === t.key ? "var(--rose)" : "var(--stone)",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
            <div style={{ maxWidth: 680, lineHeight: 1.85, color: "var(--slate)", fontSize: "0.92rem" }}>
              {tab === "description" && <p>{product.description}</p>}
              {tab === "ingredients" && <p style={{ whiteSpace: "pre-wrap" }}>{product.ingredients}</p>}
              {tab === "usage" && <p style={{ whiteSpace: "pre-wrap" }}>{product.usage}</p>}
            </div>
          </div>

          {/* ── Reviews ─────────────────────────────────────────────── */}
          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--charcoal)", marginBottom: 6 }}>Customer Reviews</h2>
            <div className="section-divider" style={{ marginBottom: "1.5rem" }} />

            <div className="grid md:grid-cols-2 gap-10">
              {/* Left: summary + list */}
              <div>
                {/* Rating summary */}
                {reviews.length > 0 && (
                  <div style={{ display: "flex", gap: 20, alignItems: "center", padding: "1rem", background: "var(--cream-deep)", borderRadius: "var(--radius-md)", marginBottom: "1.25rem" }}>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "3rem", fontWeight: 800, color: "var(--charcoal)", lineHeight: 1 }}>{product.rating.toFixed(1)}</p>
                      <div style={{ display: "flex", gap: 2, justifyContent: "center", margin: "4px 0" }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} style={i < Math.round(product.rating) ? { fill: "var(--gold)", color: "var(--gold)" } : { color: "var(--cream-deep)" }} />)}
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "var(--stone)" }}>{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      {ratingCounts.map(({ star, count, pct }) => (
                        <div key={star} className="review-bar-wrap" style={{ marginBottom: 5 }}>
                          <span style={{ width: 16, color: "var(--stone)", textAlign: "right", flexShrink: 0 }}>{star}</span>
                          <Star size={10} style={{ fill: "var(--gold)", color: "var(--gold)", flexShrink: 0 }} />
                          <div className="review-bar-bg">
                            <div className="review-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                          <span style={{ width: 24, color: "var(--stone)", textAlign: "right", flexShrink: 0 }}>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {reviews.length === 0 ? (
                    <p style={{ fontSize: "0.875rem", color: "var(--stone)" }}>No reviews yet. Be the first to review this product!</p>
                  ) : reviews.map(r => (
                    <div key={r._id} className="review-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--charcoal)" }}>{r.name}</p>
                          <p style={{ fontSize: "0.72rem", color: "var(--stone)" }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style={{ display: "flex", gap: 2 }}>
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} style={i < r.rating ? { fill: "var(--gold)", color: "var(--gold)" } : { color: "var(--cream-deep)" }} />)}
                        </div>
                      </div>
                      <p style={{ fontSize: "0.875rem", color: "var(--slate)", lineHeight: 1.6 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: write review */}
              <div className="glass-card" style={{ alignSelf: "flex-start" }}>
                <h3 style={{ fontWeight: 700, color: "var(--charcoal)", marginBottom: "1rem" }}>Write a Review</h3>
                {!session ? (
                  <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                    <p style={{ fontSize: "0.875rem", color: "var(--stone)", marginBottom: 12 }}>Sign in to leave a review</p>
                    <Link href="/auth/login" className="btn-primary text-sm">Sign In</Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label className="input-label">Your Rating</label>
                      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, transition: "transform 0.15s" }}
                            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.2)")}
                            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                            <Star size={26} style={n <= reviewForm.rating ? { fill: "var(--gold)", color: "var(--gold)" } : { color: "var(--cream-deep)" }} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="input-label" htmlFor="review-comment">Your Review</label>
                      <textarea id="review-comment" className="input" style={{ minHeight: 100, resize: "none" }} required
                        placeholder="Share your experience with this product…"
                        value={reviewForm.comment}
                        onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
                    </div>
                    <button id="submit-review-btn" type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={submitting}>
                      <Send size={14} /> {submitting ? "Submitting…" : "Submit Review"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ── Related Products (horizontal scroll) ──────────────── */}
          {related.length > 0 && (
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--charcoal)", marginBottom: 6 }}>You May Also Like</h2>
              <div className="section-divider" style={{ marginBottom: "1.25rem" }} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {related.slice(0, 4).map(p => (
                  <ProductCard key={p._id} id={p._id} name={p.name} price={p.price}
                    discountPrice={p.discountPrice} images={p.images} rating={p.rating}
                    numReviews={p.numReviews} brand={p.brand} stock={p.stock} slug={p.slug} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Sticky mobile purchase bar ─────────────────────────────── */}
      {product.stock > 0 && (
        <div className="sticky-purchase-bar">
          <button onClick={handleAddToCart} className="btn-outline flex-1 flex items-center justify-center gap-2" style={{ fontSize: "0.875rem" }}>
            <ShoppingCart size={15} /> Add to Cart
          </button>
          <button onClick={handleBuyNow} className="btn-rose flex-1 flex items-center justify-center gap-2" style={{ fontSize: "0.875rem" }}>
            <Zap size={15} /> Buy Now
          </button>
        </div>
      )}

      <Footer />
    </>
  );
}
