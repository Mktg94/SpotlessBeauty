import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/orders — get current user's orders (or all for admin)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const isAdmin = session.user.role === "admin";
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = isAdmin
      ? {}
      : { user: session.user.id ?? session.user.email };

    if (status) query.status = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return Response.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST /api/orders — create a new order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const order = await Order.create({
      ...body,
      user: session.user.id,
    });

    return Response.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
