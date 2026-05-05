"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/providers/CartProvider";
import { formatETB, getStars } from "@/lib/utils";
import { ShoppingCart, Star, Minus, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Product {
  _id: string; name: string; price: number; discountPrice?: number;
  images: string[]; rating: number; numReviews: number; brand?: string;
  stock: number; slug: string; description: string;
  category?: { name: string; slug: string };
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="skeleton aspect-square rounded-2xl" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-8 rounded-lg" />)}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32">
          <div className="text-center">
            <p className="text-6xl mb-4">😕</p>
            <h2 className="text-xl font-bold text-foreground mb-2">Product Not Found</h2>
            <Link href="/products" className="btn-gold mt-4">Back to Shop</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discount = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;
  const stars = getStars(product.rating);

  const handleAddToCart = () => {
    addItem({ id: product._id, name: product.name, price: displayPrice, image: product.images[0] ?? "", quantity: qty, stock: product.stock });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-muted hover:text-gold text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Back to Products
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                {product.images[activeImg] ? (
                  <Image src={product.images[activeImg]} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">🧴</div>
                )}
                {hasDiscount && <span className="absolute top-3 left-3 badge-discount text-sm px-3 py-1">-{discount}%</span>}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? "border-gold" : "border-white/10"}`}>
                      <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-5">
              {product.brand && <p className="text-gold text-sm font-semibold tracking-wide">{product.brand}</p>}
              <h1 className="text-3xl font-bold text-foreground leading-tight">{product.name}</h1>
              {product.category && (
                <Link href={`/products?category=${product.category.slug}`} className="text-xs text-muted hover:text-gold transition-colors">
                  {product.category.name}
                </Link>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {stars.map((s, i) => (
                    <Star key={i} size={16}
                      className={s === "full" ? "fill-gold text-gold" : s === "half" ? "fill-gold/50 text-gold" : "fill-muted/20 text-muted/20"} />
                  ))}
                </div>
                <span className="text-sm text-muted">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gold">{formatETB(displayPrice)}</span>
                {hasDiscount && <span className="text-xl text-muted line-through">{formatETB(product.price)}</span>}
              </div>

              {/* Stock */}
              <div>
                {product.stock > 0 ? (
                  <span className="text-sm text-green-400 font-medium">✓ In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-sm text-red-400 font-medium">✕ Out of Stock</span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted leading-relaxed">{product.description}</p>

              {/* Qty + Cart */}
              {product.stock > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="input-label">Qty</label>
                    <div className="flex items-center gap-2 border border-white/10 rounded-xl overflow-hidden">
                      <button id="qty-minus" onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-muted hover:text-gold hover:bg-white/5 transition-all">
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-semibold text-foreground">{qty}</span>
                      <button id="qty-plus" onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                        className="w-10 h-10 flex items-center justify-center text-muted hover:text-gold hover:bg-white/5 transition-all">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button id="add-to-cart-detail-btn" onClick={handleAddToCart} className="btn-gold w-full py-3 text-base">
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
