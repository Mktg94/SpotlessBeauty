"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatETB } from "@/lib/utils";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";

interface Order {
  _id: string; status: string; totalPrice: number; itemsPrice: number;
  shippingPrice: number; paymentMethod: string; isPaid: boolean; createdAt: string;
  shippingAddress: { fullName: string; phone: string; city: string; subCity: string; woreda?: string };
  items: { name: string; price: number; quantity: number; image: string }[];
}

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];
const STATUS_CLASS: Record<string, string> = {
  pending: "status-pending", processing: "status-processing",
  shipped: "status-shipped", delivered: "status-delivered", cancelled: "status-cancelled",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/orders/${id}`).then(r => r.json())
      .then(data => { setOrder(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id, session]);

  if (loading) return (
    <><Navbar /><main className="flex-1 flex items-center justify-center py-32" style={{ background: "var(--cream)" }}><div className="spinner" /></main><Footer /></>
  );

  if (!order) return (
    <><Navbar />
      <main className="flex-1 flex items-center justify-center py-32 text-center" style={{ background: "var(--cream)" }}>
        <div>
          <p className="text-4xl mb-4">😕</p>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--charcoal)" }}>Order not found</h2>
          <Link href="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      </main>
      <Footer /></>
  );

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ background: "var(--cream)" }}>
        <div className="container mx-auto px-4 py-8 max-w-3xl">

          {/* Success Banner */}
          <div className="glass-card text-center mb-8"
            style={{ borderColor: "rgba(22,163,74,0.2)", background: "rgba(22,163,74,0.04)" }}>
            <CheckCircle size={48} className="mx-auto mb-3" style={{ color: "#16a34a" }} />
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--charcoal)" }}>Order Confirmed!</h1>
            <p className="text-sm" style={{ color: "var(--stone)" }}>Order #{order._id.slice(-8).toUpperCase()}</p>
            <p className="text-xs mt-1" style={{ color: "var(--stone)" }}>{new Date(order.createdAt).toLocaleString()}</p>
          </div>

          {/* Status Tracker */}
          {order.status !== "cancelled" && (
            <div className="glass-card mb-6">
              <h2 className="font-bold mb-6" style={{ color: "var(--charcoal)" }}>Order Status</h2>
              <div className="flex items-start gap-0">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex-1 flex flex-col items-center relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all`}
                      style={i <= currentStep
                        ? { background: "var(--rose)", borderColor: "var(--rose)", color: "white" }
                        : { background: "white", borderColor: "var(--border-soft)", color: "var(--stone)" }}>
                      {i < currentStep ? "✓" : i + 1}
                    </div>
                    <span className="text-xs mt-1 capitalize"
                      style={{ color: i <= currentStep ? "var(--rose)" : "var(--stone)" }}>
                      {step}
                    </span>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className="absolute top-4 left-1/2 w-full h-0.5"
                        style={{ background: i < currentStep ? "var(--rose)" : "var(--border-soft)" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {order.status === "cancelled" && (
            <div className="glass-card mb-6"
              style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }}>
              <p className="font-medium text-center" style={{ color: "#dc2626" }}>This order has been cancelled.</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Items */}
            <div className="glass-card">
              <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--charcoal)" }}>
                <Package size={16} style={{ color: "var(--rose)" }} /> Items Ordered
              </h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium" style={{ color: "var(--charcoal)" }}>{item.name}</p>
                      <p className="text-xs" style={{ color: "var(--stone)" }}>Qty: {item.quantity} × {formatETB(item.price)}</p>
                    </div>
                    <span className="font-semibold" style={{ color: "var(--rose)" }}>{formatETB(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="space-y-1 text-sm pt-3" style={{ borderTop: "1px solid var(--border-soft)" }}>
                  <div className="flex justify-between" style={{ color: "var(--slate)" }}>
                    <span>Subtotal</span><span>{formatETB(order.itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between" style={{ color: "var(--slate)" }}>
                    <span>Shipping</span>
                    <span>{order.shippingPrice === 0
                      ? <span style={{ color: "#16a34a", fontWeight: 600 }}>Free</span>
                      : formatETB(order.shippingPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold" style={{ color: "var(--charcoal)" }}>
                    <span>Total</span>
                    <span style={{ color: "var(--rose)" }}>{formatETB(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="glass-card">
              <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--charcoal)" }}>
                <Truck size={16} style={{ color: "var(--rose)" }} /> Delivery Info
              </h2>
              <div className="space-y-2 text-sm" style={{ color: "var(--charcoal)" }}>
                <div><span style={{ color: "var(--stone)" }}>Name: </span>{order.shippingAddress.fullName}</div>
                <div><span style={{ color: "var(--stone)" }}>Phone: </span>{order.shippingAddress.phone}</div>
                <div><span style={{ color: "var(--stone)" }}>City: </span>{order.shippingAddress.city}</div>
                <div><span style={{ color: "var(--stone)" }}>Sub-City: </span>{order.shippingAddress.subCity}</div>
                {order.shippingAddress.woreda && (
                  <div><span style={{ color: "var(--stone)" }}>Woreda: </span>{order.shippingAddress.woreda}</div>
                )}
              </div>
              <div className="space-y-2 text-sm mt-4 pt-4" style={{ borderTop: "1px solid var(--border-soft)" }}>
                <div>
                  <span style={{ color: "var(--stone)" }}>Payment: </span>
                  <span style={{ color: "var(--charcoal)" }}>{order.paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : "Telebirr"}</span>
                </div>
                <div>
                  <span style={{ color: "var(--stone)" }}>Status: </span>
                  <span className={`status-pill ${STATUS_CLASS[order.status]}`}>{order.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center mt-8">
            <Link href="/products" className="btn-primary flex items-center gap-2">
              Continue Shopping <ArrowRight size={14} />
            </Link>
            <Link href="/orders" className="btn-ghost">
              My Orders
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
