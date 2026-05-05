import { NextRequest } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/upload
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "spotless-beauty-lab/products",
      transformation: [{ width: 800, height: 800, crop: "fill", quality: "auto" }],
    });

    return Response.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
