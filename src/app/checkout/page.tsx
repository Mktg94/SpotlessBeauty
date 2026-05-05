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
        <main className="flex-1 flex items-center justify-center py-32">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Please sign in to checkout</h2>
            <Link href="/auth/login?next=/checkout" className="btn-gold">Sign In</Link>
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
      toast.success("Order placed successfully!");
      router.push(`/orders/${order._id}`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground mb-6">Checkout</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping */}
                <div className="glass-card space-y-4">
                  <h2 className="font-bold text-foreground">Shipping Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label" htmlFor="fullName">Full Name</label>
                      <input id="fullName" className="input" required value={shipping.fullName}
                        onChange={e => setShipping(s => ({ ...s, fullName: e.target.value }))} />
                    </div>
                    <div>
                      <label className="input-label" htmlFor="phone">Phone</label>
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
                  <h2 className="font-bold text-foreground">Payment Method</h2>
                  <div className="space-y-3">
                    {[
                      { value: "cash_on_delivery", label: "Cash on Delivery", icon: "💵", desc: "Pay when you receive your order" },
                      { value: "telebirr", label: "Telebirr", icon: "📱", desc: "Coming soon — Mobile payment" },
                    ].map((pm) => (
                      <label key={pm.value}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === pm.value ? "border-gold bg-gold/5" : "border-white/10 hover:border-white/20"
                        } ${pm.value === "telebirr" ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <input type="radio" name="payment" value={pm.value} checked={paymentMethod === pm.value}
                          disabled={pm.value === "telebirr"}
                          onChange={() => { if (pm.value !== "telebirr") setPaymentMethod(pm.value as typeof paymentMethod); }}
                          className="accent-gold" />
                        <span className="text-xl">{pm.icon}</span>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{pm.label}</p>
                          <p className="text-xs text-muted">{pm.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <div className="glass-card sticky top-20 space-y-4">
                  <h2 className="font-bold text-foreground">Order Summary</h2>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {items.map(i => (
                      <div key={i.id} className="flex justify-between text-sm">
                        <span className="text-muted line-clamp-1 flex-1">{i.name} × {i.quantity}</span>
                        <span className="text-foreground ml-2 shrink-0">{formatETB(i.price * i.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between text-muted">
                      <span>Shipping</span>
                      <span>{shippingFee === 0 ? <span className="text-green-400">Free</span> : formatETB(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base text-foreground">
                      <span>Total</span>
                      <span className="text-gold">{formatETB(grandTotal)}</span>
                    </div>
                  </div>
                  <button id="place-order-btn" type="submit" className="btn-gold w-full py-3 text-base" disabled={loading}>
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
