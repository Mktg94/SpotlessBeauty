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
    <><Navbar /><main className="flex-1 flex items-center justify-center py-32"><div className="spinner" /></main><Footer /></>
  );

  if (!order) return (
    <><Navbar />
      <main className="flex-1 flex items-center justify-center py-32 text-center">
        <div><p className="text-4xl mb-4">😕</p><h2 className="text-xl font-bold mb-4">Order not found</h2>
          <Link href="/products" className="btn-gold">Continue Shopping</Link></div>
      </main>
      <Footer /></>
  );

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Success Banner */}
          <div className="glass-card text-center mb-8 border-green-500/20 bg-green-500/5">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-foreground mb-1">Order Confirmed!</h1>
            <p className="text-muted text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-muted mt-1">{new Date(order.createdAt).toLocaleString()}</p>
          </div>

          {/* Status Tracker */}
          {order.status !== "cancelled" && (
            <div className="glass-card mb-6">
              <h2 className="font-bold text-foreground mb-4">Order Status</h2>
              <div className="flex items-center gap-0">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex-1 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      i <= currentStep ? "bg-gold border-gold text-navy" : "border-white/20 text-muted"
                    }`}>
                      {i < currentStep ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs mt-1 capitalize ${i <= currentStep ? "text-gold" : "text-muted"}`}>{step}</span>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`absolute h-0.5 w-full top-4 left-1/2 ${i < currentStep ? "bg-gold" : "bg-white/10"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {order.status === "cancelled" && (
            <div className="glass-card mb-6 border-red-500/20 bg-red-500/5">
              <p className="text-red-400 font-medium text-center">This order has been cancelled.</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Items */}
            <div className="glass-card">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2"><Package size={16} /> Items Ordered</h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-muted text-xs">Qty: {item.quantity} × {formatETB(item.price)}</p>
                    </div>
                    <span className="text-gold font-semibold">{formatETB(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatETB(order.itemsPrice)}</span></div>
                  <div className="flex justify-between text-muted"><span>Shipping</span><span>{order.shippingPrice === 0 ? <span className="text-green-400">Free</span> : formatETB(order.shippingPrice)}</span></div>
                  <div className="flex justify-between font-bold text-foreground"><span>Total</span><span className="text-gold">{formatETB(order.totalPrice)}</span></div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="glass-card">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2"><Truck size={16} /> Delivery Info</h2>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted">Name: </span><span className="text-foreground">{order.shippingAddress.fullName}</span></div>
                <div><span className="text-muted">Phone: </span><span className="text-foreground">{order.shippingAddress.phone}</span></div>
                <div><span className="text-muted">City: </span><span className="text-foreground">{order.shippingAddress.city}</span></div>
                <div><span className="text-muted">Sub-City: </span><span className="text-foreground">{order.shippingAddress.subCity}</span></div>
                {order.shippingAddress.woreda && <div><span className="text-muted">Woreda: </span><span className="text-foreground">{order.shippingAddress.woreda}</span></div>}
              </div>
              <div className="border-t border-white/10 mt-4 pt-4 space-y-2 text-sm">
                <div><span className="text-muted">Payment: </span>
                  <span className="text-foreground">{order.paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : "Telebirr"}</span>
                </div>
                <div><span className="text-muted">Status: </span>
                  <span className={`status-pill ${STATUS_CLASS[order.status]}`}>{order.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center mt-8">
            <Link href="/products" className="btn-gold flex items-center gap-2">
              Continue Shopping <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
