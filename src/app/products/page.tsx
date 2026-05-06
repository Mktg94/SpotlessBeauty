"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

interface Product {
  _id: string; name: string; price: number; discountPrice?: number;
  images: string[]; rating: number; numReviews: number; brand?: string;
  stock: number; slug: string;
}
interface Category { _id: string; name: string; }

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

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Shop All Products</h1>
              {!loading && <p className="text-sm text-muted mt-1">{total} products found</p>}
            </div>
            <button id="toggle-filters-btn" onClick={() => setFiltersOpen(!filtersOpen)} className="btn-ghost flex items-center gap-2 md:hidden">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          <div className="flex gap-6">
            <aside className={`${filtersOpen ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
              <div className="glass-card sticky top-20 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-sm">Filters</h3>
                  <button onClick={clearFilters} className="text-xs text-muted hover:text-gold flex items-center gap-1"><X size={12} /> Clear</button>
                </div>
                <div>
                  <label className="input-label" htmlFor="product-search">Search</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input id="product-search" className="input pl-9" placeholder="Search products…" value={filters.search}
                      onChange={(e) => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }} />
                  </div>
                </div>
                <div>
                  <label className="input-label" htmlFor="category-filter">Category</label>
                  <select id="category-filter" className="input" value={filters.category}
                    onChange={(e) => { setFilters(f => ({ ...f, category: e.target.value })); setPage(1); }}>
                    <option value="">All Categories</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Price (ETB)</label>
                  <div className="flex gap-2">
                    <input className="input" placeholder="Min" type="number" value={filters.minPrice}
                      onChange={(e) => { setFilters(f => ({ ...f, minPrice: e.target.value })); setPage(1); }} />
                    <input className="input" placeholder="Max" type="number" value={filters.maxPrice}
                      onChange={(e) => { setFilters(f => ({ ...f, maxPrice: e.target.value })); setPage(1); }} />
                  </div>
                </div>
                <div>
                  <label className="input-label" htmlFor="sort-select">Sort By</label>
                  <select id="sort-select" className="input" value={filters.sort}
                    onChange={(e) => { setFilters(f => ({ ...f, sort: e.target.value })); setPage(1); }}>
                    <option value="createdAt">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
                <div>
                  <label className="input-label" htmlFor="skin-type-filter">Skin Type</label>
                  <select id="skin-type-filter" className="input" value={filters.skinType}
                    onChange={(e) => { setFilters(f => ({ ...f, skinType: e.target.value })); setPage(1); }}>
                    <option value="">All Skin Types</option>
                    <option value="dry">Dry</option>
                    <option value="oily">Oily</option>
                    <option value="combination">Combination</option>
                    <option value="sensitive">Sensitive</option>
                    <option value="normal">Normal</option>
                    <option value="all">All Types</option>
                  </select>
                </div>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[...Array(9)].map((_, i) => <div key={i} className="skeleton aspect-3/4 rounded-xl" />)}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-4xl mb-4">🔍</p>
                  <p className="text-muted text-lg">No products found</p>
                  <button onClick={clearFilters} className="btn-outline mt-4">Clear Filters</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <ProductCard key={p._id} id={p._id} name={p.name} price={p.price}
                        discountPrice={p.discountPrice} images={p.images} rating={p.rating}
                        numReviews={p.numReviews} brand={p.brand} stock={p.stock} slug={p.slug} />
                    ))}
                  </div>
                  {pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button className="btn-ghost px-4" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                      {[...Array(pages)].map((_, i) => (
                        <button key={i} onClick={() => setPage(i + 1)}
                          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${page === i + 1 ? "bg-gold text-navy" : "btn-ghost"}`}>
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
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => <div key={i} className="skeleton aspect-3/4 rounded-xl" />)}
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
