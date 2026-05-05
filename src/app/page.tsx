import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SeedButton from "@/components/SeedButton";
import { ArrowRight, Shield, Truck, RefreshCw, Star, CheckCircle } from "lucide-react";

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products?featured=true&limit=8`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products ?? [];
  } catch { return []; }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

const CATEGORY_IMAGES: Record<string, string> = {
  moisturizers: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
  serums: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
  cleansers: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400",
  sunscreens: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
  "eye-care": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400",
  "lip-care": "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=400",
};

const TESTIMONIALS = [
  { name: "Hana T.", location: "Addis Ababa", rating: 5, text: "I've been using the Vitamin C serum for 3 months and my skin has never looked brighter. Totally authentic — exactly what I ordered!", avatar: "HT" },
  { name: "Meron A.", location: "Hawassa", rating: 5, text: "Fast delivery and the products are genuinely imported. The CeraVe cleanser changed my skincare routine completely. Highly recommend!", avatar: "MA" },
  { name: "Sara B.", location: "Dire Dawa", rating: 5, text: "Finally a place in Ethiopia where I can trust the products are real. The La Roche-Posay sunscreen is incredible for our climate.", avatar: "SB" },
  { name: "Tigist K.", location: "Bahir Dar", rating: 4, text: "Great selection and customer service. Love that they carry Korean skincare brands. Will definitely order again!", avatar: "TK" },
];

export default async function Home() {
  const [products, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="hero-bg relative overflow-hidden">
          <div className="container mx-auto px-4 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-rose/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-rose rounded-full animate-pulse inline-block" style={{background:"var(--rose)"}}/>
                <span className="text-xs font-semibold text-slate tracking-wide">100% Authentic • Imported Direct</span>
              </div>
              <h1 className="section-title mb-6">
                Authentic Skincare<br />
                from <span className="gradient-text">USA &amp; Korea</span><br />
                <span style={{color:"var(--slate)", fontSize:"clamp(1.1rem,2.5vw,1.5rem)", fontWeight:500}}>Delivered to your door across Ethiopia</span>
              </h1>
              <p className="text-slate text-lg leading-relaxed mb-8 max-w-md">
                Shop genuine imported beauty products — the same brands you see online, now available in Ethiopia with fast, reliable delivery.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/products" className="btn-primary text-base px-7 py-3 flex items-center gap-2">
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link href="/products?featured=true" className="btn-outline text-base px-7 py-3">
                  Best Sellers
                </Link>
              </div>
              {/* Trust row */}
              <div className="flex items-center gap-5 mt-8 flex-wrap">
                {["Cruelty Free", "Genuine Imports", "Fast Delivery"].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-sm text-slate">
                    <CheckCircle size={14} style={{color:"var(--rose)"}} /> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="relative hidden md:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-[40px] bg-white/60 shadow-2xl border border-white" style={{backdropFilter:"blur(8px)"}} />
                <Image
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700"
                  alt="Authentic skincare products from USA and Korea"
                  fill className="object-cover rounded-[40px] p-3"
                  priority
                />
                {/* Origin badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-xl border border-black/5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇺🇸🇰🇷</span>
                    <div>
                      <p className="text-xs font-bold" style={{color:"var(--charcoal)"}}>USA &amp; Korean Brands</p>
                      <p className="text-xs" style={{color:"var(--stone)"}}>Verified &amp; Imported</p>
                    </div>
                  </div>
                </div>
                {/* Rating badge */}
                <div className="absolute -top-3 -right-3 bg-white rounded-2xl p-3 shadow-xl border border-black/5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} style={{fill:"var(--gold)", color:"var(--gold)"}} />)}
                    <span className="text-xs font-bold ml-1" style={{color:"var(--charcoal)"}}>4.9</span>
                  </div>
                  <p className="text-xs" style={{color:"var(--stone)"}}>2,400+ reviews</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ── */}
        <section className="border-y py-6" style={{borderColor:"var(--border-soft)", background:"var(--surface)"}}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Truck size={20} style={{color:"var(--rose)"}} />, title: "Free Shipping", desc: "Orders over 2,000 ETB" },
                { icon: <Shield size={20} style={{color:"var(--rose)"}} />, title: "100% Authentic", desc: "Guaranteed genuine products" },
                { icon: <RefreshCw size={20} style={{color:"var(--rose)"}} />, title: "Easy Returns", desc: "7-day return policy" },
                { icon: <Star size={20} style={{color:"var(--rose)"}} />, title: "Top Rated", desc: "4.9★ customer rating" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl shrink-0" style={{background:"var(--blush-light)"}}>{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold" style={{color:"var(--charcoal)"}}>{item.title}</p>
                    <p className="text-xs" style={{color:"var(--stone)"}}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        {categories.length > 0 && (
          <section className="section" style={{background:"var(--cream)"}}>
            <div className="container mx-auto px-4">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{color:"var(--rose)"}}>Browse</p>
                  <h2 className="section-title">Shop by Category</h2>
                  <div className="section-divider" />
                </div>
                <Link href="/products" className="btn-ghost text-sm hidden md:flex">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.slice(0, 6).map((cat: { _id: string; name: string; slug: string; image?: string }) => (
                  <Link key={cat._id} href={`/products?category=${cat._id}`}
                    className="group flex flex-col items-center gap-3 p-4 rounded-2xl border bg-white hover:border-rose/30 hover:shadow-md transition-all duration-300 text-center"
                    style={{borderColor:"var(--border-soft)"}}>
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden" style={{background:"var(--cream-deep)"}}>
                      <Image src={cat.image ?? CATEGORY_IMAGES[cat.slug] ?? "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200"}
                        alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <span className="text-xs font-semibold transition-colors" style={{color:"var(--slate)"}}>
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FEATURED PRODUCTS ── */}
        <section className="section" style={{background:"var(--cream-deep)"}}>
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{color:"var(--rose)"}}>Featured</p>
                <h2 className="section-title">Best Sellers</h2>
                <div className="section-divider" />
              </div>
              <Link href="/products?featured=true" className="btn-ghost text-sm hidden md:flex">
                See All <ArrowRight size={14} />
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.map((p: {
                  _id: string; name: string; price: number; discountPrice?: number;
                  images: string[]; rating: number; numReviews: number; brand?: string; stock: number; slug: string;
                }) => (
                  <ProductCard key={p._id} id={p._id} name={p.name} price={p.price}
                    discountPrice={p.discountPrice} images={p.images} rating={p.rating}
                    numReviews={p.numReviews} brand={p.brand} stock={p.stock} slug={p.slug} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border" style={{borderColor:"var(--border-soft)"}}>
                <p className="text-4xl mb-3">🌸</p>
                <p className="text-slate text-lg mb-2 font-medium">Products coming soon</p>
                <p className="text-sm mb-5" style={{color:"var(--stone)"}}>Seed the database to load sample products</p>
                <SeedButton />
              </div>
            )}
          </div>
        </section>

        {/* ── PROMO BANNER ── */}
        <section className="section" style={{background:"var(--cream)"}}>
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-14 text-center"
              style={{background:"linear-gradient(135deg, var(--charcoal) 0%, #3d2a2a 100%)"}}>
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{background:"var(--blush)", transform:"translate(30%,-30%)"}} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{background:"var(--gold)", transform:"translate(-30%,30%)"}} />
              <div className="relative">
                <div className="inline-block bg-white/10 text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 border border-white/20">
                  Limited Offer
                </div>
                <h2 className="section-title text-white mb-4">Get 10% off your first order</h2>
                <p className="mb-7 max-w-md mx-auto" style={{color:"rgba(255,255,255,0.7)"}}>
                  Create an account and unlock exclusive discounts, early access to new arrivals, and personalised beauty tips.
                </p>
                <Link href="/auth/register" className="btn-rose text-base px-8 py-3">
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="section" style={{background:"var(--cream-deep)"}}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{color:"var(--rose)"}}>Reviews</p>
              <h2 className="section-title">What Our Customers Say</h2>
              <div className="section-divider mx-auto" />
              <p className="mt-3 text-slate max-w-md mx-auto text-sm">Real customers, real results. Join thousands of happy skincare enthusiasts across Ethiopia.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="testimonial-card">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} style={i < t.rating ? {fill:"var(--gold)", color:"var(--gold)"} : {color:"var(--cream-deep)"}} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{color:"var(--slate)"}}>&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{background:"linear-gradient(135deg, var(--rose), var(--gold))"}}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{color:"var(--charcoal)"}}>{t.name}</p>
                      <p className="text-xs" style={{color:"var(--stone)"}}>{t.location}</p>
                    </div>
                    <CheckCircle size={16} className="ml-auto shrink-0" style={{color:"var(--rose)"}} />
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
