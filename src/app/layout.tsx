import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Spotless Beauty Lab — Premium Skincare in Ethiopia",
    template: "%s | Spotless Beauty Lab",
  },
  description:
    "Shop premium imported skincare and beauty products. Moisturizers, serums, cleansers & more delivered across Ethiopia.",
  keywords: ["skincare", "beauty", "Ethiopia", "Addis Ababa", "moisturizer", "serum"],
  openGraph: {
    title: "Spotless Beauty Lab",
    description: "Premium imported skincare & beauty products in Ethiopia",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
