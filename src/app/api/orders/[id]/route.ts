import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/orders/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const order = await Order.findById(id)
      .populate("user", "name email")
      .lean();

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const isOwner = (order.user as { _id?: { toString(): string } })?._id?.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json(order);
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// PATCH /api/orders/[id] — update status (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const { status, isPaid, paidAt, telebirrRef } = await req.json();

    const order = await Order.findByIdAndUpdate(
      id,
      { status, isPaid, paidAt, telebirrRef },
      { new: true, runValidators: true }
    );

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json(order);
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}
