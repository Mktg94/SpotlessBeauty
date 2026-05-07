import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/products/[id]  — supports both slug and MongoDB _id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // Try slug first (product cards link by slug), then fall back to _id
    let product = await Product.findOne({ slug: id })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      // Try MongoDB ObjectId (used by admin edit links)
      const mongoose = (await import("mongoose")).default;
      if (mongoose.Types.ObjectId.isValid(id)) {
        product = await Product.findById(id)
          .populate("category", "name slug")
          .lean();
      }
    }

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[id] — admin only
export async function PUT(
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
    const body = await req.json();

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(product);
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return Response.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id] — admin only
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ message: "Product deleted" });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
