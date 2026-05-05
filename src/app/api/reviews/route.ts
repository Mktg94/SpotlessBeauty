import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/reviews?product=<productId>
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const productId = req.nextUrl.searchParams.get("product");
    if (!productId) return Response.json({ error: "product ID required" }, { status: 400 });

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(reviews);
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST /api/reviews — authenticated users only
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return Response.json({ error: "Sign in to leave a review" }, { status: 401 });

    await connectDB();
    const { product, rating, comment } = await req.json();

    if (!product || !rating || !comment) {
      return Response.json({ error: "Product, rating, and comment are required" }, { status: 400 });
    }

    // Check for duplicate
    const existing = await Review.findOne({ product, user: session.user.id });
    if (existing) return Response.json({ error: "You have already reviewed this product" }, { status: 409 });

    const review = await Review.create({
      product,
      user: session.user.id,
      name: session.user.name,
      rating: Number(rating),
      comment,
    });

    // Recalculate product rating
    const allReviews = await Review.find({ product });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(product, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: allReviews.length,
    });

    return Response.json(review, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return Response.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
