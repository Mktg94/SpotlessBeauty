import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SeedButton from "@/components/SeedButton";
import { ArrowRight, Shield, Truck, RefreshCw, Star } from "lucide-react";

async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/products?featured=true&limit=8`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products ?? [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const CATEGORY_IMAGES: Record<string, string> = {
  moisturizers: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
  serums: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
  cleansers: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400",
  sunscreens: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
  "eye-care": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400",
  "lip-care": "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=400",
};

export default async function Home() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* ── HERO ── */}
        <section className="hero-bg relative overflow-hidden py-24 md:py-36">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-4">
                Premium Imported Skincare
              </p>
              <h1 className="section-title text-foreground mb-6">
                Glow Brighter with{" "}
                <span className="gradient-text">Spotless Beauty Lab</span>
              </h1>
              <p className="text-muted text-lg leading-relaxed mb-8 max-w-md">
                Authentic imported skincare and beauty products delivered to your door
                across Ethiopia. Your skin deserves the best.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/products" className="btn-gold text-base px-6 py-3">
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link href="/products?featured=true" className="btn-outline text-base px-6 py-3">
                  Best Sellers
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex items-center gap-4 mt-8 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-gold text-gold" />
                  ))}
                  <span className="text-sm text-muted ml-1">4.8 / 5 rating</span>
                </div>
                <span className="text-border">|</span>
                <span className="text-sm text-muted">2,400+ happy customers</span>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative hidden md:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-[40px] bg-linear-to-br from-gold/10 to-transparent border border-gold/20" />
                <Image
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700"
                  alt="Premium skincare products"
                  fill
                  className="object-cover rounded-[40px] p-4"
                  priority
                />
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 glass-card p-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    <div>
                      <p className="text-xs font-bold text-foreground">100% Authentic</p>
                      <p className="text-xs text-muted">Imported &amp; verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ── */}
        <section className="border-y border-white/10 bg-navy-mid/40">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Truck size={20} className="text-gold" />, title: "Free Shipping", desc: "Orders over 2,000 ETB" },
                { icon: <Shield size={20} className="text-gold" />, title: "100% Authentic", desc: "Guaranteed genuine products" },
                { icon: <RefreshCw size={20} className="text-gold" />, title: "Easy Returns", desc: "7-day return policy" },
                { icon: <Star size={20} className="text-gold" />, title: "Top Rated", desc: "4.8★ customer rating" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gold/10 border border-gold/20 shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        {categories.length > 0 && (
          <section className="section">
            <div className="container mx-auto px-4">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-2">Browse</p>
                  <h2 className="section-title">Shop by Category</h2>
                </div>
                <Link href="/products" className="btn-ghost text-sm hidden md:flex">
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.slice(0, 6).map((cat: { _id: string; name: string; slug: string; image?: string }) => (
                  <Link
                    key={cat._id}
                    href={`/products?category=${cat._id}`}
                    className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-white/10 bg-glass hover:border-gold/30 hover:bg-glass-hover transition-all duration-300 text-center"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5">
                      <Image
                        src={cat.image ?? CATEGORY_IMAGES[cat.slug] ?? "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200"}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-xs font-semibold text-muted group-hover:text-gold transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FEATURED PRODUCTS ── */}
        <section className="section bg-navy-mid/30">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-2">Featured</p>
                <h2 className="section-title">Best Sellers</h2>
              </div>
              <Link href="/products?featured=true" className="btn-ghost text-sm hidden md:flex">
                See All <ArrowRight size={14} />
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p: {
                  _id: string; name: string; price: number; discountPrice?: number;
                  images: string[]; rating: number; numReviews: number; brand?: string;
                  stock: number; slug: string;
                }) => (
                  <ProductCard
                    key={p._id}
                    id={p._id}
                    name={p.name}
                    price={p.price}
                    discountPrice={p.discountPrice}
                    images={p.images}
                    rating={p.rating}
                    numReviews={p.numReviews}
                    brand={p.brand}
                    stock={p.stock}
                    slug={p.slug}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted text-lg mb-4">No products yet.</p>
                <p className="text-sm text-muted mb-6">Seed the database to get started.</p>
                <SeedButton />
              </div>
            )}
          </div>
        </section>

        {/* ── PROMO BANNER ── */}
        <section className="section">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-linear-to-r from-navy-mid via-navy to-navy-mid p-8 md:p-12 text-center">
              <div className="absolute inset-0 bg-linear-to-r from-gold/5 via-gold/10 to-gold/5" />
              <div className="relative">
                <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">Special Offer</p>
                <h2 className="section-title mb-4">
                  Get 10% off your first order
                </h2>
                <p className="text-muted mb-6 max-w-md mx-auto">
                  Sign up today and enjoy exclusive discounts, early access to new arrivals, and beauty tips.
                </p>
                <Link href="/auth/register" className="btn-gold text-base px-8 py-3">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
