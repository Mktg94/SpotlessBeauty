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
  { name: "Meron A.", location: "Addis Ababa", rating: 5, text: "Fast delivery and the products are genuinely imported. The CeraVe cleanser changed my skincare routine completely. Highly recommend!", avatar: "MA" },
  { name: "Sara B.", location: "Addis Ababa", rating: 5, text: "Finally a place in Ethiopia where I can trust the products are real. The La Roche-Posay sunscreen is incredible for our climate.", avatar: "SB" },
  { name: "Tigist K.", location: "Addis Ababa", rating: 4, text: "Great selection and customer service. Love that they carry Korean skincare brands. Will definitely order again!", avatar: "TK" },
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
        <section className="relative overflow-hidden" style={{ minHeight: "85vh", background: "linear-gradient(135deg, #fdfbf9 0%, #faf6f4 50%, #fef9f6 100%)" }}>
          {/* Geometric background pattern */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.4 }}>
            <svg style={{ width: "100%", height: "100%" }} viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.5" fill="var(--rose)" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          {/* Floating orbs */}
          <div style={{ position: "absolute", top: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(181,103,109,0.15) 0%, transparent 70%)", filter: "blur(40px)", animation: "float 8s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "15%", left: "3%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,106,0.12) 0%, transparent 70%)", filter: "blur(35px)", animation: "float 10s ease-in-out infinite reverse" }} />

          <div className="container mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-16 items-center" style={{ position: "relative", minHeight: "inherit" }}>
            <div className="animate-fade-up" style={{ maxWidth: 560 }}>
              {/* Elegant badge */}
              <div className="inline-flex items-center gap-2.5 border rounded-full px-5 py-2 mb-8"
                style={{ borderColor: "rgba(181,103,109,0.15)", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--rose)" }} />
                <span className="text-xs font-medium tracking-wider uppercase" style={{ color: "var(--rose)" }}>Premium Beauty & Fashion</span>
              </div>

              <h1 className="mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, color: "var(--charcoal)" }}>
                Discover Your
                <span className="gradient-text" style={{ display: "block" }}>Natural Glow</span>
              </h1>
              <p style={{ color: "var(--stone)", fontSize: "1.125rem", lineHeight: 1.75, marginBottom: "2rem", maxWidth: 480 }}>
                Curated collection of authentic Korean & US skincare, plus elegant fashion accessories. Imported directly to Ethiopia.
              </p>

              {/* Modern pill badges */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "2rem" }}>
                {[
                  { icon: "🌿", label: "Cruelty Free" },
                  { icon: "✓", label: "100% Authentic" },
                  { icon: "🚀", label: "Fast Delivery" },
                ].map(b => (
                  <span key={b.label} style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "white", border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: 100, padding: "8px 16px",
                    fontSize: "0.85rem", fontWeight: 500, color: "var(--charcoal)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                  }}>
                    <span>{b.icon}</span> {b.label}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex gap-4 flex-wrap">
                <Link href="/products" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2.5 font-semibold">
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link href="/products?featured=true" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px", fontSize: "1rem", fontWeight: 500,
                  borderRadius: "var(--radius)", border: "1.5px solid var(--charcoal)",
                  color: "var(--charcoal)", background: "transparent",
                  transition: "all 0.2s"
                }}>
                  Explore Collection
                </Link>
              </div>

              {/* Trust indicators */}
              <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex" }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />)}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>4.9</span>
                </div>
                <span style={{ color: "var(--stone)", fontSize: "0.9rem" }}>2,400+ happy customers</span>
              </div>
            </div>

            {/* Hero image - modern floating card */}
            <div className="relative hidden lg:block" style={{ perspective: "1000px" }}>
              <div className="relative" style={{
                transform: "rotateY(-5deg) rotateX(5deg)",
                transition: "transform 0.5s ease"
              }}>
                {/* Main image container */}
                <div className="relative aspect-4/5 max-w-md mx-auto" style={{
                  borderRadius: "32px",
                  overflow: "hidden",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.15), 0 20px 40px rgba(181,103,109,0.1)"
                }}>
                  <Image
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800"
                    alt="Premium skincare collection"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Overlay gradient */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 40%)" }} />
                </div>

                {/* Floating badge - repositioned */}
                <div style={{
                  position: "absolute", bottom: 30, right: -20,
                  background: "white", borderRadius: "20px", padding: "16px 20px",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.12)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "12px",
                      background: "linear-gradient(135deg, var(--rose) 0%, var(--blush) 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontSize: "1.2rem"
                    }}>✨</div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "var(--charcoal)" }}>New Arrivals</p>
                      <p className="text-xs" style={{ color: "var(--stone)" }}>Updated daily</p>
                    </div>
                  </div>
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
