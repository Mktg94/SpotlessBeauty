import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// GET /api/categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return Response.json(categories);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/categories — admin only
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const category = await Category.create({
      ...body,
      slug: body.slug ?? slugify(body.name),
    });

    return Response.json(category, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return Response.json({ error: "Failed to create category" }, { status: 500 });
  }
}
