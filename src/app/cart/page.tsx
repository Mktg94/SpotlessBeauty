"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/providers/CartProvider";
import { formatETB } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQty, removeItem, clearCart } = useCart();

  if (totalItems === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32">
          <div className="text-center">
            <ShoppingBag size={64} className="text-muted mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted mb-6">Add some products to get started</p>
            <Link href="/products" className="btn-gold">Start Shopping</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const shipping = totalPrice >= 2000 ? 0 : 150;
  const grandTotal = totalPrice + shipping;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground mb-6">Shopping Cart ({totalItems} items)</h1>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="glass-card flex gap-4">
                  <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white/5">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🧴</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2">{item.name}</h3>
                    <p className="text-gold font-bold mt-1">{formatETB(item.price)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 border border-white/10 rounded-lg overflow-hidden">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted hover:text-gold hover:bg-white/5 transition-all">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted hover:text-gold hover:bg-white/5 transition-all">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-muted hover:text-red-400 transition-colors ml-auto">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-foreground">{formatETB(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="text-sm text-muted hover:text-red-400 transition-colors flex items-center gap-1">
                <Trash2 size={14} /> Clear cart
              </button>
            </div>

            {/* Order Summary */}
            <div>
              <div className="glass-card sticky top-20 space-y-4">
                <h2 className="font-bold text-foreground">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatETB(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-400">Free</span> : formatETB(shipping)}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted">Free shipping on orders over {formatETB(2000)}</p>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-foreground text-base">
                    <span>Total</span>
                    <span className="text-gold">{formatETB(grandTotal)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn-gold w-full py-3 text-base text-center block">
                  Proceed to Checkout
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
