"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, X, Sparkles } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

interface Product {
  _id: string; name: string; price: number; discountPrice?: number;
  images: string[]; rating: number; numReviews: number; brand?: string;
  stock: number; slug: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const FASHION_SLUGS = ["women-bags", "luxury-scarfs"];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") ?? "",
    category: searchParams.get("category") ?? "",
    minPrice: "",
    maxPrice: "",
    sort: "createdAt",
    featured: searchParams.get("featured") ?? "",
    skinType: "",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.featured) params.set("featured", filters.featured);
      params.set("page", String(page));
      params.set("limit", "12");
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
    } finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const clearFilters = () => {
    setFilters({ search: "", category: "", minPrice: "", maxPrice: "", sort: "createdAt", featured: "", skinType: "" });
    setPage(1);
    router.replace("/products", { scroll: false });
  };

  const skincareCategories = categories.filter(c => !FASHION_SLUGS.includes(c.slug));
  const fashionCategories = categories.filter(c => FASHION_SLUGS.includes(c.slug));

  // Detect if selected category is fashion
  const selectedCat = categories.find(c => c._id === filters.category);
  const isFashionSelected = selectedCat ? FASHION_SLUGS.includes(selectedCat.slug) : false;

  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.featured;

  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ background: "var(--cream)" }}>
        <div className="container mx-auto px-4 py-8">

          {/* Page header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--charcoal)" }}>
                {filters.category && selectedCat ? selectedCat.name : "All Products"}
              </h1>
              {!loading && <p style={{ fontSize: "0.82rem", color: "var(--stone)", marginTop: 2 }}>{total} products found</p>}
            </div>
            <button id="toggle-filters-btn" onClick={() => setFiltersOpen(!filtersOpen)} className="btn-ghost flex items-center gap-2 md:hidden">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          {/* Category chip quick-filters */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.5rem", overflowX: "auto", paddingBottom: 4 }}>
            <button onClick={() => { setFilters(f => ({ ...f, category: "", featured: "" })); setPage(1); }}
              className={`category-chip ${!filters.category && !filters.featured ? "active" : ""}`}>
              All
            </button>
            <button onClick={() => { setFilters(f => ({ ...f, category: "", featured: "true" })); setPage(1); }}
              className={`category-chip ${filters.featured === "true" ? "active" : ""}`}>
              ⭐ Best Sellers
            </button>
            {skincareCategories.map(c => (
              <button key={c._id}
                onClick={() => { setFilters(f => ({ ...f, category: c._id, featured: "" })); setPage(1); }}
                className={`category-chip ${filters.category === c._id ? "active" : ""}`}>
                {c.name}
              </button>
            ))}
            {fashionCategories.length > 0 && (
              <>
                <span style={{ width: 1, height: 28, background: "var(--border-soft)", alignSelf: "center", flexShrink: 0 }} />
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Sparkles size={10} style={{ color: "var(--gold)" }} />
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Fashion</span>
                </span>
                {fashionCategories.map(c => (
                  <button key={c._id}
                    onClick={() => { setFilters(f => ({ ...f, category: c._id, featured: "" })); setPage(1); }}
                    className={`category-chip fashion-chip ${filters.category === c._id ? "active" : ""}`}>
                    {c.slug === "women-bags" ? "👜" : "🧣"} {c.name}
                  </button>
                ))}
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            {/* Sidebar filters */}
            <aside className={`${filtersOpen ? "block" : "hidden"} md:block`} style={{ width: 240, flexShrink: 0 }}>
              <div className="glass-card sticky top-20" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontWeight: 600, color: "var(--charcoal)", fontSize: "0.875rem" }}>Filters</h3>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "var(--stone)", display: "flex", alignItems: "center", gap: 3, fontFamily: "inherit" }}>
                      <X size={12} /> Clear all
                    </button>
                  )}
                </div>

                {/* Search */}
                <div>
                  <label className="input-label" htmlFor="product-search">Search</label>
                  <div style={{ position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--stone)" }} />
                    <input id="product-search" className="input" style={{ paddingLeft: 32 }} placeholder="Search products…"
                      value={filters.search}
                      onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }} />
                  </div>
                </div>

                {/* Category select */}
                <div>
                  <label className="input-label" htmlFor="category-filter">Category</label>
                  <select id="category-filter" className="input" value={filters.category}
                    onChange={e => { setFilters(f => ({ ...f, category: e.target.value })); setPage(1); }}>
                    <option value="">All Categories</option>
                    {skincareCategories.length > 0 && (
                      <optgroup label="🌿 Skincare">
                        {skincareCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </optgroup>
                    )}
                    {fashionCategories.length > 0 && (
                      <optgroup label="👜 Fashion Accessories">
                        {fashionCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </optgroup>
                    )}
                  </select>
                </div>

                {/* Price range */}
                <div>
                  <label className="input-label">Price (ETB)</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input className="input" placeholder="Min" type="number" value={filters.minPrice}
                      onChange={e => { setFilters(f => ({ ...f, minPrice: e.target.value })); setPage(1); }} />
                    <input className="input" placeholder="Max" type="number" value={filters.maxPrice}
                      onChange={e => { setFilters(f => ({ ...f, maxPrice: e.target.value })); setPage(1); }} />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="input-label" htmlFor="sort-select">Sort By</label>
                  <select id="sort-select" className="input" value={filters.sort}
                    onChange={e => { setFilters(f => ({ ...f, sort: e.target.value })); setPage(1); }}>
                    <option value="createdAt">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                {/* Skin type — hidden for fashion categories */}
                {!isFashionSelected && (
                  <div>
                    <label className="input-label" htmlFor="skin-type-filter">Skin Type</label>
                    <select id="skin-type-filter" className="input" value={filters.skinType}
                      onChange={e => { setFilters(f => ({ ...f, skinType: e.target.value })); setPage(1); }}>
                      <option value="">All Skin Types</option>
                      <option value="dry">Dry</option>
                      <option value="oily">Oily</option>
                      <option value="combination">Combination</option>
                      <option value="sensitive">Sensitive</option>
                      <option value="normal">Normal</option>
                      <option value="all">All Types</option>
                    </select>
                  </div>
                )}

                {/* Fashion notice */}
                {isFashionSelected && (
                  <div style={{ background: "var(--cream-deep)", borderRadius: "var(--radius-md)", padding: "0.75rem", fontSize: "0.78rem", color: "var(--slate)" }}>
                    <span className="fashion-badge" style={{ marginBottom: 6, display: "inline-flex" }}><Sparkles size={9} /> Fashion</span>
                    <p>Browsing {selectedCat?.name} — imported luxury collection.</p>
                  </div>
                )}
              </div>
            </aside>

            {/* Product grid */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[...Array(9)].map((_, i) => <div key={i} className="skeleton rounded-xl" style={{ aspectRatio: "3/4" }} />)}
                </div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
                  <p style={{ fontSize: "3rem", marginBottom: 12 }}>🔍</p>
                  <p style={{ color: "var(--slate)", fontSize: "1.1rem", fontWeight: 500, marginBottom: 8 }}>No products found</p>
                  <p style={{ color: "var(--stone)", fontSize: "0.875rem", marginBottom: 20 }}>Try adjusting your filters</p>
                  <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {products.map(p => (
                      <ProductCard key={p._id} id={p._id} name={p.name} price={p.price}
                        discountPrice={p.discountPrice} images={p.images} rating={p.rating}
                        numReviews={p.numReviews} brand={p.brand} stock={p.stock} slug={p.slug} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pages > 1 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: "2rem" }}>
                      <button className="btn-ghost px-4" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                      {[...Array(pages)].map((_, i) => (
                        <button key={i} onClick={() => setPage(i + 1)}
                          style={{
                            width: 36, height: 36, borderRadius: "var(--radius-sm)",
                            fontSize: "0.875rem", fontWeight: 600,
                            background: page === i + 1 ? "var(--charcoal)" : "var(--cream-deep)",
                            color: page === i + 1 ? "white" : "var(--slate)",
                            border: "none", cursor: "pointer", fontFamily: "inherit",
                            transition: "all 0.15s",
                          }}>
                          {i + 1}
                        </button>
                      ))}
                      <button className="btn-ghost px-4" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>Next</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main className="flex-1" style={{ background: "var(--cream)" }}>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => <div key={i} className="skeleton rounded-xl" style={{ aspectRatio: "3/4" }} />)}
            </div>
          </div>
        </main>
        <Footer />
      </>
    }>
      <ProductsContent />
    </Suspense>
  );
}
