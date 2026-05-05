import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/stats
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueResult,
      recentOrders,
      ordersByStatus,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const revenue = revenueResult[0]?.total ?? 0;

    return Response.json({
      totalUsers,
      totalProducts,
      totalOrders,
      revenue,
      recentOrders,
      ordersByStatus,
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
