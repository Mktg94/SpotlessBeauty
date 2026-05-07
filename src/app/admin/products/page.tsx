"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { formatETB, slugify } from "@/lib/utils";
import { Package, LayoutDashboard, ShoppingBag, Plus, Pencil, Trash2, Upload, X, Info } from "lucide-react";
import toast from "react-hot-toast";

interface Category { _id: string; name: string; }
interface Product {
  _id: string; name: string; price: number; discountPrice?: number;
  images: string[]; stock: number; isFeatured: boolean; brand?: string;
  category?: { _id: string; name: string };
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const emptyForm = { name: "", description: "", price: "", discountPrice: "", brand: "", stock: "0", category: "", isFeatured: false, images: [] as string[] };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user?.role !== "admin")) {
      router.replace("/");
    }
  }, [session, status, router]);

  const fetchProducts = () => {
    fetch("/api/products?limit=50").then(r => r.json()).then(d => {
      setProducts(d.products ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchProducts();
      fetch("/api/categories").then(r => r.json()).then(setCategories).catch(() => {});
    }
  }, [session]);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowModal(true); };
  const openEdit = (p: Product) => {
    setForm({
      name: p.name, description: "", price: String(p.price), discountPrice: String(p.discountPrice ?? ""),
      brand: p.brand ?? "", stock: String(p.stock), category: p.category?._id ?? "",
      isFeatured: p.isFeatured, images: p.images,
    });
    setEditingId(p._id);
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm(f => ({ ...f, images: [...f.images, data.url] }));
      toast.success("Image uploaded!");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) { toast.error("Name, price and category are required"); return; }
    const payload = {
      name: form.name, description: form.description, price: parseFloat(form.price),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
      brand: form.brand, stock: parseInt(form.stock), category: form.category,
      isFeatured: form.isFeatured, images: form.images,
      slug: editingId ? undefined : slugify(form.name),
    };
    try {
      const res = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success(editingId ? "Product updated!" : "Product created!");
      setShowModal(false);
      fetchProducts();
    } catch { toast.error("Failed to save product"); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); fetchProducts(); }
    else toast.error("Delete failed");
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32"><div className="spinner" /></main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-1">
        <aside className="admin-sidebar hidden md:flex flex-col p-4 gap-1">
          <p className="text-xs font-semibold text-muted uppercase tracking-widest px-3 mb-2">Admin</p>
          {[
            { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
            { href: "/admin/products", label: "Products", icon: <Package size={16} />, active: true },
            { href: "/admin/orders", label: "Orders", icon: <ShoppingBag size={16} /> },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={`admin-nav-item ${item.active ? "active" : ""}`}>
              {item.icon} {item.label}
            </Link>
          ))}
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            <button id="add-product-btn" onClick={openCreate} className="btn-gold flex items-center gap-2">
              <Plus size={16} /> Add Product
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                          {p.images[0] ? <Image src={p.images[0]} alt={p.name} fill className="object-cover" /> : <span className="text-lg flex items-center justify-center h-full">🧴</span>}
                        </div>
                        <span className="font-medium text-sm line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="text-muted text-sm">{p.category?.name ?? "—"}</td>
                    <td className="text-gold font-semibold">{formatETB(p.price)}</td>
                    <td>
                      <span className={`text-sm font-medium ${p.stock === 0 ? "text-red-400" : p.stock <= 5 ? "text-orange-400" : "text-green-400"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>{p.isFeatured ? <span className="text-gold text-sm">★ Yes</span> : <span className="text-muted text-sm">No</span>}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="icon-btn" title="Edit"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="icon-btn hover:text-red-400" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}
            style={{ border: "1px solid var(--border-soft)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-foreground">{editingId ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowModal(false)} className="icon-btn"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="input-label">Name *</label><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><label className="input-label">Description</label><textarea className="input min-h-20 resize-none" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="input-label">Price (ETB) *</label><input className="input" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
                <div>
                  <label className="input-label">Discount Price</label>
                  <input className="input" type="number" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))} />
                </div>
              </div>
              {/* Seasonal discount tip */}
              <div style={{ display: "flex", gap: 8, padding: "0.6rem 0.75rem", background: "var(--blush-light)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--slate)" }}>
                <Info size={13} style={{ color: "var(--rose)", flexShrink: 0, marginTop: 1 }} />
                <span><strong>Seasonal / Discounted products:</strong> Set a <em>Discount Price</em> lower than the regular Price. The product will automatically show the discount badge and crossed-out original price in the store. Check <em>Featured</em> to include it in Best Sellers.</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="input-label">Brand</label><input className="input" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} /></div>
                <div><label className="input-label">Stock</label><input className="input" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} /></div>
              </div>
              <div>
                <label className="input-label" htmlFor="category-select">Category *</label>
                <select id="category-select" className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Select category</option>
                  <optgroup label="🌿 Skincare">
                    {categories.filter(c => !["women-bags","luxury-scarfs"].includes(c.name.toLowerCase().replace(" ","-"))).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </optgroup>
                  <optgroup label="👜 Fashion Accessories">
                    {categories.filter(c => ["Women Bags","Luxury Scarfs"].includes(c.name)).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </optgroup>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-gold" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                <span className="text-sm text-foreground">Featured product</span>
              </label>
              <div>
                <label className="input-label">Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-soft)" }}>
                      <Image src={img} alt="product" fill className="object-cover" />
                      <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">×</button>
                    </div>
                  ))}
                </div>
                <label className="btn-ghost cursor-pointer text-sm flex items-center gap-2 w-fit">
                  <Upload size={14} /> {uploading ? "Uploading…" : "Upload Image"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
              <button id="save-product-btn" onClick={handleSave} className="btn-gold w-full py-3">
                {editingId ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
