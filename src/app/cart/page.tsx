"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/providers/CartProvider";
import { formatETB } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQty, removeItem, clearCart } = useCart();

  if (totalItems === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32" style={{ background: "var(--cream)" }}>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "var(--blush-light)" }}>
              <ShoppingBag size={36} style={{ color: "var(--rose)" }} />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--charcoal)" }}>Your cart is empty</h1>
            <p className="mb-6" style={{ color: "var(--stone)" }}>Add some products to get started</p>
            <Link href="/products" className="btn-primary">Start Shopping</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const shippingFee = totalPrice >= 2000 ? 0 : 150;
  const grandTotal = totalPrice + shippingFee;

  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ background: "var(--cream)" }}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--charcoal)" }}>
            Shopping Cart <span className="text-base font-normal" style={{ color: "var(--stone)" }}>({totalItems} items)</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="glass-card flex gap-4">
                  <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden"
                    style={{ background: "var(--cream-deep)" }}>
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🧴</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2" style={{ color: "var(--charcoal)" }}>{item.name}</h3>
                    <p className="font-bold mt-1" style={{ color: "var(--rose)" }}>{formatETB(item.price)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: "var(--border-soft)" }}>
                        <button onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center transition-colors"
                          style={{ color: "var(--slate)" }}
                          onMouseOver={undefined}>
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold" style={{ color: "var(--charcoal)" }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center transition-colors"
                          style={{ color: "var(--slate)" }}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)}
                        className="ml-auto transition-colors"
                        style={{ color: "var(--stone)", background: "none", border: "none", cursor: "pointer" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold" style={{ color: "var(--charcoal)" }}>{formatETB(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
              <button onClick={clearCart}
                className="text-sm flex items-center gap-1 transition-colors"
                style={{ color: "var(--stone)", background: "none", border: "none", cursor: "pointer" }}>
                <Trash2 size={14} /> Clear cart
              </button>
            </div>

            {/* Order Summary */}
            <div>
              <div className="glass-card sticky top-20 space-y-4">
                <h2 className="font-bold" style={{ color: "var(--charcoal)" }}>Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between" style={{ color: "var(--slate)" }}>
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatETB(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between" style={{ color: "var(--slate)" }}>
                    <span>Shipping</span>
                    <span>{shippingFee === 0
                      ? <span style={{ color: "#16a34a" }}>Free</span>
                      : formatETB(shippingFee)}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-xs" style={{ color: "var(--stone)" }}>
                      Free shipping on orders over {formatETB(2000)}
                    </p>
                  )}
                  <div className="pt-3 flex justify-between font-bold text-base"
                    style={{ borderTop: "1px solid var(--border-soft)", color: "var(--charcoal)" }}>
                    <span>Total</span>
                    <span style={{ color: "var(--rose)" }}>{formatETB(grandTotal)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn-primary w-full py-3 text-base text-center flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
                <Link href="/products" className="btn-ghost w-full py-2.5 text-sm text-center block">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
