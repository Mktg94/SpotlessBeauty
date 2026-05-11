"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { formatETB } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingBag, Users, TrendingUp, Eye, Menu, X } from "lucide-react";

interface Stats {
  totalUsers: number; totalProducts: number; totalOrders: number; revenue: number;
  recentOrders: { _id: string; user?: { name: string; email: string }; totalPrice: number; status: string; createdAt: string }[];
}

const STATUS_CLASS: Record<string, string> = {
  pending: "status-pending", processing: "status-processing",
  shipped: "status-shipped", delivered: "status-delivered", cancelled: "status-cancelled",
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user?.role !== "admin")) {
      router.replace("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetch("/api/admin/stats")
        .then(r => r.json())
        .then(setStats)
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32">
          <div className="spinner" />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-1">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-20 left-4 z-50 p-2 bg-background border rounded-md shadow-lg"
        >
          <Menu size={20} />
        </button>

        {/* Sidebar - mobile drawer */}
        <aside className={`admin-sidebar flex flex-col p-4 gap-1 md:fixed md:inset-y-0 md:left-0 md:z-40 md:transform md:transition-transform md:duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted uppercase tracking-widest px-3">Admin</p>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1">
              <X size={18} />
            </button>
          </div>
          {[
            { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
            { href: "/admin/products", label: "Products", icon: <Package size={16} /> },
            { href: "/admin/orders", label: "Orders", icon: <ShoppingBag size={16} /> },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="admin-nav-item">
              {item.icon} {item.label}
            </Link>
          ))}
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main */}
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: formatETB(stats?.revenue ?? 0), icon: <TrendingUp size={20} className="text-gold" />, color: "from-gold/10" },
              { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: <ShoppingBag size={20} className="text-blue-400" />, color: "from-blue-500/10" },
              { label: "Products", value: stats?.totalProducts ?? 0, icon: <Package size={20} className="text-purple-400" />, color: "from-purple-500/10" },
              { label: "Customers", value: stats?.totalUsers ?? 0, icon: <Users size={20} className="text-green-400" />, color: "from-green-500/10" },
            ].map((card) => (
              <div key={card.label} className="stat-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted uppercase tracking-wider">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-gold hover:underline">View all</Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <p className="font-medium">{order.user?.name ?? "Guest"}</p>
                        <p className="text-xs text-muted">{order.user?.email}</p>
                      </td>
                      <td className="text-gold font-semibold">{formatETB(order.totalPrice)}</td>
                      <td>
                        <span className={`status-pill ${STATUS_CLASS[order.status] ?? ""}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="text-muted text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link href={`/admin/orders?id=${order._id}`} className="icon-btn">
                          <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
