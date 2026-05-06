"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/providers/CartProvider";
import { formatETB } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";
import { CheckCircle, CreditCard, Truck } from "lucide-react";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash_on_delivery" | "telebirr">("cash_on_delivery");

  const [shipping, setShipping] = useState({
    fullName: session?.user?.name ?? "",
    phone: "",
    city: "Addis Ababa",
    subCity: "",
    woreda: "",
  });

  if (!session) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32" style={{ background: "var(--cream)" }}>
          <div className="text-center glass-card max-w-sm mx-auto py-10">
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--charcoal)" }}>Sign in to checkout</h2>
            <p className="text-sm mb-5" style={{ color: "var(--stone)" }}>You need an account to place an order</p>
            <Link href="/auth/login?next=/checkout" className="btn-primary">Sign In</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  const shippingFee = totalPrice >= 2000 ? 0 : 150;
  const grandTotal = totalPrice + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.subCity) { toast.error("Please enter your sub-city"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
            product: i.id, name: i.name, image: i.image, price: i.price, quantity: i.quantity,
          })),
          shippingAddress: shipping,
          paymentMethod,
          itemsPrice: totalPrice,
          shippingPrice: shippingFee,
          totalPrice: grandTotal,
        }),
      });
      if (!res.ok) throw new Error("Failed to place order");
      const order = await res.json();
      clearCart();
      toast.success("Order placed successfully! 🎉");
      router.push(`/orders/${order._id}`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ background: "var(--cream)" }}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--charcoal)" }}>Checkout</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">

                {/* Shipping Info */}
                <div className="glass-card space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck size={18} style={{ color: "var(--rose)" }} />
                    <h2 className="font-bold" style={{ color: "var(--charcoal)" }}>Shipping Information</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label" htmlFor="fullName">Full Name</label>
                      <input id="fullName" className="input" required value={shipping.fullName}
                        onChange={e => setShipping(s => ({ ...s, fullName: e.target.value }))} />
                    </div>
                    <div>
                      <label className="input-label" htmlFor="phone">Phone Number</label>
                      <input id="phone" className="input" required placeholder="+251 9XX XXX XXX" value={shipping.phone}
                        onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))} />
                    </div>
                    <div>
                      <label className="input-label" htmlFor="city">City</label>
                      <input id="city" className="input" required value={shipping.city}
                        onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} />
                    </div>
                    <div>
                      <label className="input-label" htmlFor="subCity">Sub-City</label>
                      <input id="subCity" className="input" required placeholder="e.g. Bole, Yeka, Kirkos" value={shipping.subCity}
                        onChange={e => setShipping(s => ({ ...s, subCity: e.target.value }))} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="input-label" htmlFor="woreda">Woreda / Kebele (Optional)</label>
                      <input id="woreda" className="input" value={shipping.woreda}
                        onChange={e => setShipping(s => ({ ...s, woreda: e.target.value }))} />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="glass-card space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard size={18} style={{ color: "var(--rose)" }} />
                    <h2 className="font-bold" style={{ color: "var(--charcoal)" }}>Payment Method</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "cash_on_delivery", label: "Cash on Delivery", icon: "💵", desc: "Pay when you receive your order" },
                      { value: "telebirr", label: "Telebirr", icon: "📱", desc: "Coming soon — Mobile payment", disabled: true },
                    ].map((pm) => (
                      <label key={pm.value}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${pm.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                        style={{
                          borderColor: paymentMethod === pm.value ? "var(--rose)" : "var(--border-soft)",
                          background: paymentMethod === pm.value ? "var(--blush-light)" : "white",
                        }}>
                        <input type="radio" name="payment" value={pm.value}
                          checked={paymentMethod === pm.value}
                          disabled={pm.disabled}
                          onChange={() => { if (!pm.disabled) setPaymentMethod(pm.value as typeof paymentMethod); }}
                          style={{ accentColor: "var(--rose)" }} />
                        <span className="text-xl">{pm.icon}</span>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: "var(--charcoal)" }}>{pm.label}</p>
                          <p className="text-xs" style={{ color: "var(--stone)" }}>{pm.desc}</p>
                        </div>
                        {paymentMethod === pm.value && !pm.disabled && (
                          <CheckCircle size={16} className="ml-auto" style={{ color: "var(--rose)" }} />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="glass-card sticky top-20 space-y-4">
                  <h2 className="font-bold" style={{ color: "var(--charcoal)" }}>Order Summary</h2>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {items.map(i => (
                      <div key={i.id} className="flex justify-between text-sm">
                        <span className="line-clamp-1 flex-1" style={{ color: "var(--slate)" }}>{i.name} × {i.quantity}</span>
                        <span className="ml-2 shrink-0 font-medium" style={{ color: "var(--charcoal)" }}>{formatETB(i.price * i.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm pt-3" style={{ borderTop: "1px solid var(--border-soft)" }}>
                    <div className="flex justify-between" style={{ color: "var(--slate)" }}>
                      <span>Shipping</span>
                      <span>{shippingFee === 0
                        ? <span style={{ color: "#16a34a", fontWeight: 600 }}>Free</span>
                        : formatETB(shippingFee)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-1">
                      <span style={{ color: "var(--charcoal)" }}>Total</span>
                      <span style={{ color: "var(--rose)" }}>{formatETB(grandTotal)}</span>
                    </div>
                  </div>
                  <button id="place-order-btn" type="submit" className="btn-primary w-full py-3 text-base" disabled={loading}>
                    {loading ? "Placing Order…" : "Place Order"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
