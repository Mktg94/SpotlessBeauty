import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Category from "@/models/Category";
import Product from "@/models/Product";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// POST /api/seed — requires SEED_SECRET in production
export async function POST(req: Request) {
  // In production, require a secret token to prevent abuse
  if (process.env.NODE_ENV === "production") {
    const body = await req.json().catch(() => ({}));
    if (body?.secret !== process.env.SEED_SECRET) {
      return Response.json({ error: "Invalid seed secret" }, { status: 403 });
    }
  }

  try {
    await connectDB();

    // Seed admin user
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      const hashedPw = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 12);
      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPw,
        role: "admin",
      });
    }

    // Seed categories
    const categoryData = [
      { name: "Moisturizers", slug: "moisturizers", description: "Face & body moisturizers", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400" },
      { name: "Serums", slug: "serums", description: "Targeted treatment serums", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400" },
      { name: "Cleansers", slug: "cleansers", description: "Gentle face cleansers", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400" },
      { name: "Sunscreens", slug: "sunscreens", description: "SPF sun protection", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400" },
      { name: "Eye Care", slug: "eye-care", description: "Eye creams & treatments", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400" },
      { name: "Lip Care", slug: "lip-care", description: "Lip balms & treatments", image: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=400" },
      // Fashion category with subcategories
      { name: "Fashion", slug: "fashion", description: "Fashion accessories", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400" },
      { name: "Women Bags", slug: "women-bags", description: "Luxury women handbags & totes", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400", parent: "fashion" as string },
      { name: "Luxury Scarfs", slug: "luxury-scarfs", description: "Premium scarves & wraps", image: "https://images.unsplash.com/photo-1601924287811-2046d44c5e3e?w=400", parent: "fashion" as string },
    ];

    const categories: { name: string; slug: string; _id: mongoose.Types.ObjectId }[] = [];
    for (const cat of categoryData) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (existing) {
        categories.push(existing as { name: string; slug: string; _id: mongoose.Types.ObjectId });
      } else {
        const created = await Category.create(cat);
        categories.push(created as { name: string; slug: string; _id: mongoose.Types.ObjectId });
      }
    }

    const getCatId = (name: string): mongoose.Types.ObjectId | undefined =>
      categories.find((c) => c.name === name)?._id;

    // Seed products
    const productData = [
      {
        name: "Hydrating Rose Moisturizer",
        slug: "hydrating-rose-moisturizer",
        description: "A luxurious daily moisturizer infused with rose water and hyaluronic acid for deep hydration.",
        price: 1200,
        discountPrice: 980,
        images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600"],
        category: getCatId("Moisturizers"),
        brand: "Cetaphil",
        stock: 50,
        isFeatured: true,
        rating: 4.8,
        numReviews: 124,
      },
      {
        name: "Vitamin C Brightening Serum",
        slug: "vitamin-c-brightening-serum",
        description: "15% Vitamin C serum that reduces dark spots and brightens skin tone.",
        price: 2500,
        discountPrice: 1999,
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600"],
        category: getCatId("Serums"),
        brand: "TruSkin",
        stock: 30,
        isFeatured: true,
        rating: 4.7,
        numReviews: 89,
      },
      {
        name: "Gentle Foam Cleanser",
        slug: "gentle-foam-cleanser",
        description: "Sulfate-free foaming cleanser for all skin types. Removes makeup and impurities.",
        price: 850,
        images: ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600"],
        category: getCatId("Cleansers"),
        brand: "CeraVe",
        stock: 80,
        isFeatured: true,
        rating: 4.9,
        numReviews: 210,
      },
      {
        name: "SPF 50 Daily Sunscreen",
        slug: "spf-50-daily-sunscreen",
        description: "Lightweight, non-greasy SPF 50 sunscreen with UVA/UVB protection.",
        price: 1500,
        images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600"],
        category: getCatId("Sunscreens"),
        brand: "La Roche-Posay",
        stock: 45,
        isFeatured: true,
        rating: 4.6,
        numReviews: 67,
      },
      {
        name: "Retinol Eye Cream",
        slug: "retinol-eye-cream",
        description: "Reduces fine lines and puffiness around eyes with 0.5% retinol.",
        price: 3200,
        discountPrice: 2800,
        images: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600"],
        category: getCatId("Eye Care"),
        brand: "RoC",
        stock: 25,
        isFeatured: false,
        rating: 4.5,
        numReviews: 43,
      },
      {
        name: "Nourishing Lip Butter",
        slug: "nourishing-lip-butter",
        description: "Deeply nourishing shea butter lip treatment for dry, chapped lips.",
        price: 450,
        images: ["https://images.unsplash.com/photo-1503236823255-94609f598e71?w=600"],
        category: getCatId("Lip Care"),
        brand: "Vaseline",
        stock: 100,
        isFeatured: false,
        rating: 4.4,
        numReviews: 156,
      },
    ];

    let productsCreated = 0;
    for (const prod of productData) {
      const existing = await Product.findOne({ slug: prod.slug });
      if (!existing) {
        await Product.create(prod);
        productsCreated++;
      }
    }

    return Response.json({
      message: "Database seeded successfully",
      productsCreated,
      categoriesCreated: categories.length,
    });
  } catch (error) {
    console.error("POST /api/seed error:", error);
    return Response.json({ error: "Seeding failed" }, { status: 500 });
  }
}
