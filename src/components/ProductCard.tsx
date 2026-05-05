"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { formatETB } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  rating: number;
  numReviews: number;
  brand?: string;
  stock: number;
  slug: string;
}

export default function ProductCard({
  id,
  name,
  price,
  discountPrice,
  images,
  rating,
  numReviews,
  brand,
  stock,
  slug,
}: ProductCardProps) {
  const { addItem } = useCart();

  const displayPrice = discountPrice ?? price;
  const hasDiscount = discountPrice && discountPrice < price;
  const discount = hasDiscount ? Math.round(((price - discountPrice!) / price) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (stock <= 0) return;
    addItem({ id, name, price: displayPrice, image: images[0] ?? "", quantity: 1, stock });
    toast.success(`${name} added to cart!`);
  };

  return (
    <Link href={`/products/${slug}`} className="product-card group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-white/5">
        {images[0] ? (
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-4xl">🧴</div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <span className="badge-discount">-{discount}%</span>
          )}
          {stock <= 5 && stock > 0 && (
            <span className="badge-low-stock">Only {stock} left</span>
          )}
          {stock === 0 && (
            <span className="badge-out-stock">Out of Stock</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        {brand && <p className="text-xs text-gold/80 font-medium">{brand}</p>}
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">{name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(rating) ? "fill-gold text-gold" : "fill-muted/30 text-muted/30"}
              />
            ))}
          </div>
          <span className="text-xs text-muted">({numReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-bold text-gold">{formatETB(displayPrice)}</span>
          {hasDiscount && (
            <span className="text-xs text-muted line-through">{formatETB(price)}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          id={`add-to-cart-${id}`}
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="btn-cart mt-2"
        >
          <ShoppingCart size={14} />
          {stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}
