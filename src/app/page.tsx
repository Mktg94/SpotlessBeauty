import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSlider from "@/components/ProductSlider";
import SeedButton from "@/components/SeedButton";
import {
  ArrowRight, Shield, Truck, Star, CheckCircle,
  Package, Lock, Sparkles,
} from "lucide-react";

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function hasFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products?featured=true&limit=1`, { cache: "no-store" });
    if (!res.ok) return false;
    const d = await res.json();
    return (d.products ?? []).length > 0;
  } catch { return false; }
}

const CATEGORY_IMAGES: Record<string, string> = {
  moisturizers: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
  serums: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
  cleansers: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400",
  sunscreens: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
  "eye-care": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400",
  "lip-care": "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=400",
  "women-bags": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
  "luxury-scarfs": "https://images.unsplash.com/photo-1601924287811-2046d44c5e3e?w=400",
};

const TESTIMONIALS = [
  { name: "Hana T.", location: "Addis Ababa", rating: 5, text: "I've been using the Vitamin C serum for 3 months and my skin has never looked brighter. Totally authentic — exactly what I ordered!", avatar: "HT" },
  { name: "Meron A.", location: "Hawassa", rating: 5, text: "Fast delivery and the products are genuinely imported. The CeraVe cleanser changed my skincare routine completely. Highly recommend!", avatar: "MA" },
  { name: "Sara B.", location: "Dire Dawa", rating: 5, text: "Finally a place in Ethiopia where I can trust the products are real. The La Roche-Posay sunscreen is incredible for our climate.", avatar: "SB" },
  { name: "Tigist K.", location: "Bahir Dar", rating: 4, text: "Great selection and customer service. Love that they carry Korean skincare brands. Will definitely order again!", avatar: "TK" },
];

export default async function Home() {
  const [categories, hasProducts] = await Promise.all([getCategories(), hasFeaturedProducts()]);

  const skincareCategories = categories.filter((c: { slug: string }) =>
    !["women-bags", "luxury-scarfs"].includes(c.slug)
  );
  const fashionCategories = categories.filter((c: { slug: string }) =>
    ["women-bags", "luxury-scarfs"].includes(c.slug)
  );

  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="hero-bg relative overflow-hidden">
          {/* Decorative blobs */}
          <div style={{ position: "absolute", top: "-80px", right: "-80px", width: 400, height: 400, borderRadius: "50%", background: "var(--blush-light)", opacity: 0.5, filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "-40px", width: 300, height: 300, borderRadius: "50%", background: "var(--gold-light)", opacity: 0.3, filter: "blur(50px)", pointerEvents: "none" }} />

          <div className="container mx-auto px-4 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center" style={{ position: "relative" }}>
            <div className="animate-fade-up">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border rounded-full px-4 py-1.5 mb-6"
                style={{ borderColor: "rgba(181,103,109,0.2)" }}>
                <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: "var(--rose)" }} />
                <span className="text-xs font-semibold tracking-wide" style={{ color: "var(--slate)" }}>100% Authentic • Imported Direct</span>
              </div>

              <h1 className="section-title mb-4">
                Authentic Korean &amp; US<br />
                <span className="gradient-text">Beauty Products</span>
              </h1>
              <p style={{ color: "var(--slate)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 460 }}>
                Shop genuine imported skincare, bags &amp; accessories — the same brands you love online, now delivered across Ethiopia.
              </p>

              {/* Origin pills */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.75rem" }}>
                {[
                  { flag: "🇺🇸", label: "Imported from USA" },
                  { flag: "🇰🇷", label: "Imported from Korea" },
                ].map(b => (
                  <span key={b.label} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "white", border: "1px solid var(--border-soft)",
                    borderRadius: 99, padding: "5px 14px",
                    fontSize: "0.8rem", fontWeight: 600, color: "var(--charcoal)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                  }}>
                    <span style={{ fontSize: "1rem" }}>{b.flag}</span> {b.label}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex gap-3 flex-wrap">
                <Link href="/products" className="btn-primary text-base px-7 py-3 flex items-center gap-2">
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link href="/products?featured=true" className="btn-outline text-base px-7 py-3">
                  Best Sellers
                </Link>
              </div>

              {/* Mini trust row */}
              <div style={{ display: "flex", gap: 20, marginTop: "1.5rem", flexWrap: "wrap" }}>
                {["Cruelty Free", "Genuine Imports", "Fast Delivery"].map(t => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "var(--slate)" }}>
                    <CheckCircle size={13} style={{ color: "var(--rose)" }} /> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="relative hidden md:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-[40px] bg-white/60 shadow-2xl border border-white" style={{ backdropFilter: "blur(8px)" }} />
                <Image
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700"
                  alt="Authentic skincare products from USA and Korea"
                  fill className="object-cover rounded-[40px] p-3"
                  priority
                />
                <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl p-3.5 z-10"
                  style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.18)", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🇺🇸🇰🇷</span>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "var(--charcoal)" }}>USA &amp; Korean Brands</p>
                      <p className="text-xs" style={{ color: "var(--stone)" }}>Verified &amp; Imported</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3.5 z-10"
                  style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.18)", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} style={{ fill: "var(--gold)", color: "var(--gold)" }} />)}
                    <span className="text-xs font-bold ml-1" style={{ color: "var(--charcoal)" }}>4.9</span>
                  </div>
                  <p className="text-xs font-medium" style={{ color: "var(--stone)" }}>2,400+ reviews</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ─────────────────────────────────────────── */}
        <section className="border-y py-8" style={{ borderColor: "var(--border-soft)", background: "var(--surface)" }}>
          <div className="container mx-auto px-4">
            <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { icon: <Shield size={20} style={{ color: "var(--rose)" }} />, title: "100% Authentic", desc: "Guaranteed genuine" },
                { icon: <span style={{ fontSize: "1.2rem" }}>🇺🇸</span>, title: "Imported from USA", desc: "Direct from source" },
                { icon: <span style={{ fontSize: "1.2rem" }}>🇰🇷</span>, title: "Imported from Korea", desc: "K-beauty originals" },
                { icon: <Truck size={20} style={{ color: "var(--rose)" }} />, title: "Free Delivery", desc: "Orders over 20,000 ETB · Addis Ababa" },
                { icon: <Lock size={20} style={{ color: "var(--rose)" }} />, title: "Secure Checkout", desc: "Telebirr & Cash on Delivery" },
                { icon: <Shield size={20} style={{ color: "var(--gold)" }} />, title: "Authenticity Guarantee", desc: "Return if not genuine" },
              ].map((item) => (
                <div key={item.title} className="trust-badge-item" style={{ minWidth: 90 }}>
                  <div className="trust-icon-wrap">{item.icon}</div>
                  <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--charcoal)" }}>{item.title}</p>
                  <p style={{ fontSize: "0.68rem", color: "var(--stone)", textAlign: "center" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ───────────────────────────────────────────── */}
        {categories.length > 0 && (
          <section className="section" style={{ background: "var(--cream)" }}>
            <div className="container mx-auto px-4">
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem" }}>
                <div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rose)", marginBottom: 4 }}>Browse</p>
                  <h2 className="section-title">Shop by Category</h2>
                  <div className="section-divider" />
                </div>
                <Link href="/products" className="btn-ghost text-sm hidden md:flex">View All <ArrowRight size={14} /></Link>
              </div>

              {skincareCategories.length > 0 && (
                <>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--stone)", marginBottom: "0.75rem" }}>🌿 Skincare</p>
                  <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {skincareCategories.map((cat: { _id: string; name: string; slug: string; image?: string }) => (
                      <Link key={cat._id} href={`/products?category=${cat._id}`}
                        className="group flex flex-col items-center gap-3 p-4 rounded-2xl border bg-white hover:border-rose/30 hover:shadow-md transition-all duration-300 text-center"
                        style={{ borderColor: "var(--border-soft)" }}>
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden" style={{ background: "var(--cream-deep)" }}>
                          <Image src={cat.image ?? CATEGORY_IMAGES[cat.slug] ?? "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200"}
                            alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--slate)" }}>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {fashionCategories.length > 0 && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--stone)" }}>👜 Fashion Accessories</p>
                    <span className="fashion-badge"><Sparkles size={9} /> New</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {fashionCategories.map((cat: { _id: string; name: string; slug: string; image?: string }) => (
                      <Link key={cat._id} href={`/products?category=${cat._id}`} className="collection-card group" style={{ aspectRatio: "3/1.2" }}>
                        <Image src={cat.image ?? CATEGORY_IMAGES[cat.slug] ?? "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"}
                          alt={cat.name} fill className="object-cover" />
                        <div className="collection-card-overlay" />
                        <div style={{ position: "absolute", bottom: 0, left: 0, padding: "1rem 1.25rem" }}>
                          <span className="fashion-badge" style={{ marginBottom: 6, display: "inline-flex" }}><Sparkles size={9} /> Fashion</span>
                          <p style={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}>{cat.name}</p>
                          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem" }}>Shop the collection →</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* ── PRODUCT SLIDERS ──────────────────────────────────────── */}
        {hasProducts ? (
          <>
            <section className="section" style={{ background: "var(--cream-deep)" }}>
              <div className="container mx-auto px-4">
                <ProductSlider title="Best Sellers" subtitle="Our most-loved products, trusted by thousands"
                  apiQuery="?featured=true&limit=12" viewAllHref="/products?featured=true" accentColor="rose" />
              </div>
            </section>

            <section className="section" style={{ background: "var(--cream)" }}>
              <div className="container mx-auto px-4">
                <ProductSlider title="New Arrivals" subtitle="Fresh products just added to the store"
                  apiQuery="?sort=createdAt&limit=10" viewAllHref="/products" accentColor="rose" badge="🆕 Just Added" />
              </div>
            </section>

            {fashionCategories.length > 0 && (
              <section className="section" style={{ background: "var(--surface-3)" }}>
                <div className="container mx-auto px-4">
                  <ProductSlider title="Fashion Accessories" subtitle="Luxury bags &amp; scarfs — imported for you"
                    apiQuery={`?category=${fashionCategories.map((c: { _id: string }) => c._id).join(",")}&limit=10`}
                    viewAllHref="/products" accentColor="gold" badge="👜 New Category" />
                </div>
              </section>
            )}

            <section className="section" style={{ background: "var(--cream-deep)" }}>
              <div className="container mx-auto px-4">
                <ProductSlider title="Trending Now" subtitle="Top rated by our community"
                  apiQuery="?sort=rating&limit=10" viewAllHref="/products" accentColor="rose" badge="⭐ Top Rated" />
              </div>
            </section>
          </>
        ) : (
          <section className="section" style={{ background: "var(--cream-deep)" }}>
            <div className="container mx-auto px-4">
              <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: "var(--border-soft)" }}>
                <p className="text-4xl mb-3">🌸</p>
                <p style={{ color: "var(--slate)", fontSize: "1.1rem", marginBottom: 8, fontWeight: 500 }}>Products coming soon</p>
                <p style={{ fontSize: "0.875rem", color: "var(--stone)", marginBottom: 20 }}>Seed the database to load sample products</p>
                <SeedButton />
              </div>
            </div>
          </section>
        )}

        {/* ── PROMO BANNER ─────────────────────────────────────────── */}
        <section className="section" style={{ background: "var(--cream)" }}>
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-14 text-center"
              style={{ background: "linear-gradient(135deg, var(--charcoal) 0%, #3d2a2a 100%)" }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "var(--blush)", transform: "translate(30%,-30%)" }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: "var(--gold)", transform: "translate(-30%,30%)" }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", color: "white", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 18px", borderRadius: 99, marginBottom: 16, border: "1px solid rgba(255,255,255,0.2)" }}>
                  <Package size={12} /> Limited Offer
                </div>
                <h2 className="section-title text-white mb-4">Get 10% off your first order</h2>
                <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "1.75rem", maxWidth: 420, marginInline: "auto", lineHeight: 1.7 }}>
                  Create an account and unlock exclusive discounts, early access to new arrivals, and personalised beauty tips.
                </p>
                <Link href="/auth/register" className="btn-rose text-base px-8 py-3">Create Free Account</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── COLLECTION BANNERS ───────────────────────────────────── */}
        <section className="section" style={{ background: "var(--cream-deep)" }}>
          <div className="container mx-auto px-4">
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rose)", marginBottom: 4 }}>Collections</p>
              <h2 className="section-title">Shop Our Collections</h2>
              <div className="section-divider mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Korean Skincare", desc: "Authentic K-beauty from top brands", href: "/products", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800", badge: "🌿 Skincare" },
                { title: "Fashion Accessories", desc: "Luxury bags & scarfs — new arrivals", href: "/products", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800", badge: "👜 Fashion" },
              ].map(c => (
                <Link key={c.title} href={c.href} className="collection-card">
                  <Image src={c.img} alt={c.title} fill className="object-cover" />
                  <div className="collection-card-overlay" />
                  <div style={{ position: "absolute", bottom: 0, left: 0, padding: "1.5rem 1.75rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.15)", color: "white", fontSize: "0.72rem", fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 8, backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}>{c.badge}</span>
                    <p style={{ color: "white", fontWeight: 700, fontSize: "1.4rem", lineHeight: 1.2 }}>{c.title}</p>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem", marginTop: 4 }}>{c.desc}</p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, color: "white", fontSize: "0.82rem", fontWeight: 600 }}>
                      Shop Now <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
        <section className="section" style={{ background: "var(--cream)" }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rose)", marginBottom: 6 }}>Reviews</p>
              <h2 className="section-title">What Our Customers Say</h2>
              <div className="section-divider mx-auto" />
              <p style={{ marginTop: 12, color: "var(--slate)", maxWidth: 400, marginInline: "auto", fontSize: "0.9rem", lineHeight: 1.6 }}>
                Real customers, real results. Join thousands of happy beauty enthusiasts across Ethiopia.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="testimonial-card">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} style={i < t.rating ? { fill: "var(--gold)", color: "var(--gold)" } : { color: "var(--cream-deep)" }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--slate)" }}>&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: "linear-gradient(135deg, var(--rose), var(--gold))" }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>{t.name}</p>
                      <p className="text-xs" style={{ color: "var(--stone)" }}>{t.location}</p>
                    </div>
                    <CheckCircle size={16} className="ml-auto shrink-0" style={{ color: "var(--rose)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
