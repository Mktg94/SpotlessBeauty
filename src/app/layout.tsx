import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Spotless Skin Lab — Authentic Skincare from USA & Korea",
    template: "%s | Spotless Skin Lab",
  },
  description:
    "Shop 100% authentic imported skincare and beauty products from the USA and Korea. Moisturizers, serums, cleansers & more — delivered across Ethiopia.",
  keywords: ["skincare", "beauty", "Ethiopia", "Korean skincare", "USA beauty", "Addis Ababa", "moisturizer", "serum"],
  openGraph: {
    title: "Spotless Skin Lab",
    description: "Authentic imported skincare & beauty products in Ethiopia",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Providers>{children}</Providers>
        <WhatsAppButton />
      </body>
    </html>
  );
}

