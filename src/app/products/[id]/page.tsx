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
import { ShoppingCart, Star, Minus, Plus, ArrowLeft, Zap, CheckCircle, Send } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  _id: string; name: string; price: number; discountPrice?: number;
  images: string[]; rating: number; numReviews: number; brand?: string;
  stock: number; slug: string; description: string; ingredients?: string; usage?: string;
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
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
        // Fetch related products by same category
        if (data.category?._id) {
          fetch(`/api/products?category=${data.category._id}&limit=4`)
            .then(r => r.json())
            .then(d => setRelated((d.products ?? []).filter((p: Product) => p._id !== id)));
        }
      })
      .catch(() => setLoading(false));

    // Fetch reviews
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

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

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

  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ background: "var(--cream)" }}>
        <div className="container mx-auto px-4 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--stone)" }}>
            <Link href="/" className="hover:text-rose transition-colors" style={{ color: "var(--stone)" }}>Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-rose transition-colors" style={{ color: "var(--stone)" }}>Shop</Link>
            {product.category && <>
              <span>/</span>
              <Link href={`/products?category=${product.category._id}`} className="hover:text-rose transition-colors" style={{ color: "var(--stone)" }}>{product.category.name}</Link>
            </>}
            <span>/</span>
            <span style={{ color: "var(--charcoal)" }} className="font-medium">{product.name}</span>
          </nav>

          {/* Product Main */}
          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {/* Images */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border" style={{ borderColor: "var(--border-soft)" }}>
                {product.images[activeImg] ? (
                  <Image src={product.images[activeImg]} alt={product.name} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl" style={{ background: "var(--cream-deep)" }}>🧴</div>
                )}
                {hasDiscount && <span className="absolute top-3 left-3 badge-discount">-{discount}% OFF</span>}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all"
                      style={{ borderColor: activeImg === i ? "var(--rose)" : "var(--border-soft)" }}>
                      <Image src={img} alt={`view ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4">
              {product.brand && (
                <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--rose)" }}>{product.brand}</p>
              )}
              <h1 className="text-3xl font-bold leading-tight" style={{ color: "var(--charcoal)" }}>{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {stars.map((s, i) => (
                    <Star key={i} size={16}
                      style={s === "full" ? { fill: "var(--gold)", color: "var(--gold)" }
                        : s === "half" ? { fill: "var(--gold-light)", color: "var(--gold)" }
                        : { color: "var(--cream-deep)" }} />
                  ))}
                </div>
                <span className="text-sm" style={{ color: "var(--stone)" }}>
                  {product.rating.toFixed(1)} ({product.numReviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 py-2">
                <span className="text-4xl font-bold" style={{ color: "var(--charcoal)" }}>{formatETB(displayPrice)}</span>
                {hasDiscount && <span className="text-xl line-through" style={{ color: "var(--stone)" }}>{formatETB(product.price)}</span>}
                {hasDiscount && <span className="badge-discount">Save {discount}%</span>}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2">
                {product.stock > 10 ? (
                  <><CheckCircle size={16} style={{ color: "#16a34a" }} /><span className="text-sm font-medium" style={{ color: "#16a34a" }}>In Stock</span></>
                ) : product.stock > 0 ? (
                  <><CheckCircle size={16} style={{ color: "#d97706" }} /><span className="text-sm font-medium" style={{ color: "#d97706" }}>Only {product.stock} left</span></>
                ) : (
                  <span className="text-sm font-medium" style={{ color: "#dc2626" }}>Out of Stock</span>
                )}
              </div>

              {/* Qty + Actions */}
              {product.stock > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <label className="input-label">Qty</label>
                    <div className="flex items-center rounded-xl overflow-hidden border" style={{ borderColor: "var(--border-soft)" }}>
                      <button id="qty-minus" onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-cream-deep"
                        style={{ color: "var(--slate)" }}>
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center font-semibold" style={{ color: "var(--charcoal)" }}>{qty}</span>
                      <button id="qty-plus" onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                        className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-cream-deep"
                        style={{ color: "var(--slate)" }}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button id="add-to-cart-btn" onClick={handleAddToCart} className="btn-outline flex-1 py-3 flex items-center justify-center gap-2">
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                    <button id="buy-now-btn" onClick={handleBuyNow} className="btn-rose flex-1 py-3 flex items-center justify-center gap-2">
                      <Zap size={16} /> Buy Now
                    </button>
                  </div>
                </div>
              )}

              {/* Trust */}
              <div className="pt-2 border-t space-y-2" style={{ borderColor: "var(--border-soft)" }}>
                {["100% Authentic — imported & verified", "Free shipping on orders over 2,000 ETB", "7-day easy returns"].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs" style={{ color: "var(--stone)" }}>
                    <CheckCircle size={13} style={{ color: "var(--rose)", flexShrink: 0 }} /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs: Description / Ingredients / Usage */}
          <div className="mb-16">
            <div className="flex gap-0 border-b mb-6" style={{ borderColor: "var(--border-soft)" }}>
              {tabs.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className="px-6 py-3 text-sm font-semibold border-b-2 transition-all"
                  style={{
                    borderBottomColor: tab === t.key ? "var(--rose)" : "transparent",
                    color: tab === t.key ? "var(--rose)" : "var(--stone)",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="max-w-2xl prose prose-sm" style={{ color: "var(--slate)", lineHeight: 1.8 }}>
              {tab === "description" && <p>{product.description}</p>}
              {tab === "ingredients" && <p style={{ whiteSpace: "pre-wrap" }}>{product.ingredients}</p>}
              {tab === "usage" && <p style={{ whiteSpace: "pre-wrap" }}>{product.usage}</p>}
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--charcoal)" }}>Customer Reviews</h2>
            <div className="section-divider mb-6" />
            <div className="grid md:grid-cols-2 gap-8">
              {/* Review list */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm" style={{ color: "var(--stone)" }}>No reviews yet. Be the first to review this product!</p>
                ) : reviews.map(r => (
                  <div key={r._id} className="review-card">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "var(--charcoal)" }}>{r.name}</p>
                        <p className="text-xs" style={{ color: "var(--stone)" }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} style={i < r.rating ? { fill: "var(--gold)", color: "var(--gold)" } : { color: "var(--cream-deep)" }} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: "var(--slate)" }}>{r.comment}</p>
                  </div>
                ))}
              </div>

              {/* Write review */}
              <div className="glass-card">
                <h3 className="font-bold mb-4" style={{ color: "var(--charcoal)" }}>Write a Review</h3>
                {!session ? (
                  <div className="text-center py-6">
                    <p className="text-sm mb-3" style={{ color: "var(--stone)" }}>Sign in to leave a review</p>
                    <Link href="/auth/login" className="btn-primary text-sm">Sign In</Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="input-label">Your Rating</label>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                            className="p-1 transition-transform hover:scale-110" style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <Star size={24} style={n <= reviewForm.rating ? { fill: "var(--gold)", color: "var(--gold)" } : { color: "var(--cream-deep)" }} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="input-label" htmlFor="review-comment">Your Review</label>
                      <textarea id="review-comment" className="input min-h-24 resize-none" required
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

          {/* Related Products */}
          {related.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--charcoal)" }}>You May Also Like</h2>
              <div className="section-divider mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {related.map(p => (
                  <ProductCard key={p._id} id={p._id} name={p.name} price={p.price}
                    discountPrice={p.discountPrice} images={p.images} rating={p.rating}
                    numReviews={p.numReviews} brand={p.brand} stock={p.stock} slug={p.slug} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
