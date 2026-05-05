"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { formatETB } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

interface Order {
  _id: string; user?: { name: string; email: string }; totalPrice: number;
  status: string; paymentMethod: string; isPaid: boolean; createdAt: string;
  items: { name: string; quantity: number }[];
}

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_CLASS: Record<string, string> = {
  pending: "status-pending", processing: "status-processing",
  shipped: "status-shipped", delivered: "status-delivered", cancelled: "status-cancelled",
};

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user?.role !== "admin")) router.replace("/");
  }, [session, status, router]);

  const fetchOrders = (sv = "") => {
    const p = new URLSearchParams({ limit: "50" });
    if (sv) p.set("status", sv);
    fetch(`/api/orders?${p}`).then(r => r.json())
      .then(d => { setOrders(d.orders ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { if (session?.user?.role === "admin") fetchOrders(); }, [session]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
      toast.success("Status updated");
    } catch { toast.error("Update failed"); }
    finally { setUpdatingId(null); }
  };

  if (status === "loading" || loading) return (
    <><Navbar /><main className="flex-1 flex items-center justify-center py-32"><div className="spinner" /></main></>
  );

  return (
    <>
      <Navbar />
      <div className="flex flex-1">
        <aside className="admin-sidebar hidden md:flex flex-col p-4 gap-1">
          <p className="text-xs font-semibold text-muted uppercase tracking-widest px-3 mb-2">Admin</p>
          {[
            { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
            { href: "/admin/products", label: "Products", icon: <Package size={16} /> },
            { href: "/admin/orders", label: "Orders", icon: <ShoppingBag size={16} />, active: true },
          ].map(item => (
            <Link key={item.href} href={item.href} className={`admin-nav-item ${item.active ? "active" : ""}`}>
              {item.icon} {item.label}
            </Link>
          ))}
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-foreground">Orders</h1>
            <select id="orders-status-filter" className="input w-auto" value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); fetchOrders(e.target.value); }}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-muted py-8">No orders found</td></tr>
                ) : orders.map(order => (
                  <tr key={order._id}>
                    <td className="text-xs text-muted font-mono">{order._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <p className="font-medium text-sm">{order.user?.name ?? "—"}</p>
                      <p className="text-xs text-muted">{order.user?.email}</p>
                    </td>
                    <td className="text-sm text-muted">
                      {order.items.slice(0, 2).map((i, idx) => <div key={idx}>{i.name} ×{i.quantity}</div>)}
                      {order.items.length > 2 && <div className="text-xs">+{order.items.length - 2} more</div>}
                    </td>
                    <td className="text-gold font-semibold">{formatETB(order.totalPrice)}</td>
                    <td>
                      <div className="text-xs font-medium">{order.paymentMethod === "cash_on_delivery" ? "Cash" : "Telebirr"}</div>
                      <div className={`text-xs ${order.isPaid ? "text-green-400" : "text-orange-400"}`}>{order.isPaid ? "Paid" : "Unpaid"}</div>
                    </td>
                    <td>
                      <select className="input py-1 text-xs w-32 mb-1" value={order.status} disabled={updatingId === order._id}
                        onChange={e => handleStatusChange(order._id, e.target.value)}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                      <span className={`status-pill ${STATUS_CLASS[order.status]} block w-fit`}>{order.status}</span>
                    </td>
                    <td className="text-muted text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}
