"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatETB } from "@/lib/utils";
import { ShoppingBag, User, ChevronRight } from "lucide-react";

interface Order {
  _id: string; status: string; totalPrice: number; createdAt: string;
  items: { name: string; quantity: number }[];
  paymentMethod: string;
}

const STATUS_CLASS: Record<string, string> = {
  pending: "status-pending", processing: "status-processing",
  shipped: "status-shipped", delivered: "status-delivered", cancelled: "status-cancelled",
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/login?next=/orders");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/orders")
        .then(r => r.json())
        .then(d => { setOrders(d.orders ?? []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (status === "loading" || loading) return (
    <><Navbar /><main className="flex-1 flex items-center justify-center py-32"><div className="spinner" /></main><Footer /></>
  );

  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ background: "var(--cream)" }}>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Profile Header */}
          <div className="glass-card mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, var(--rose), var(--gold))" }}>
              <User size={24} color="white" />
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: "var(--charcoal)" }}>{session?.user?.name}</p>
              <p className="text-sm" style={{ color: "var(--stone)" }}>{session?.user?.email}</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--charcoal)" }}>My Orders</h1>
          <div className="section-divider mb-6" />

          {orders.length === 0 ? (
            <div className="glass-card text-center py-16">
              <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: "var(--stone)" }} />
              <h2 className="font-bold text-lg mb-2" style={{ color: "var(--charcoal)" }}>No orders yet</h2>
              <p className="text-sm mb-5" style={{ color: "var(--stone)" }}>When you place an order, it will appear here.</p>
              <Link href="/products" className="btn-primary">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <Link key={order._id} href={`/orders/${order._id}`}
                  className="glass-card flex items-center gap-4 hover:shadow-md transition-all group no-underline block"
                  style={{ textDecoration: "none" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: "var(--charcoal)" }}>
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <span className={`status-pill ${STATUS_CLASS[order.status] ?? ""}`}>{order.status}</span>
                    </div>
                    <p className="text-xs mb-1" style={{ color: "var(--stone)" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-ET", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <p className="text-xs" style={{ color: "var(--stone)" }}>
                      {order.items.slice(0, 2).map(i => `${i.name} ×${i.quantity}`).join(", ")}
                      {order.items.length > 2 && ` +${order.items.length - 2} more`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold" style={{ color: "var(--charcoal)" }}>{formatETB(order.totalPrice)}</p>
                    <p className="text-xs" style={{ color: "var(--stone)" }}>
                      {order.paymentMethod === "cash_on_delivery" ? "Cash" : "Telebirr"}
                    </p>
                  </div>
                  <ChevronRight size={16} style={{ color: "var(--stone)", flexShrink: 0 }} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
