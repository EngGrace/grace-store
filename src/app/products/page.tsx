"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const tile = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);


  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem(product);
    setAddedIds((prev) => new Set(prev).add(product._id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product._id);
        return next;
      });
    }, 1200);
  };

  const handleTileClick = (id: string) => {
    router.push(`/products/${id}`);
  };

  if (loading)
    return (
      <div
        className="container"
        style={{ padding: "120px 0", textAlign: "center", color: "var(--muted)" }}
      >
        Loading products…
      </div>
    );

  return (
    <div className="container" style={{ padding: "60px 20px" }}>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", marginBottom: 64 }}
      >
        <h1
          style={{
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          Our Collection
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 18, maxWidth: 480, margin: "0 auto" }}>
          Premium electronics, curated for you.
        </p>
      </motion.div>

      {/* Invisible product grid */}
      <motion.div className="products-grid" variants={container} initial="hidden" animate="show">
        {products.map((product) => (
          <motion.div 
            key={product._id} 
            variants={tile} 
            className="product-tile"
            onClick={() => handleTileClick(product._id)}
          >
            {/* Product image */}
            <div className="product-tile-image-wrap">
              <img
                src={
                  product.image ||
                  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
                }
                alt={product.name}
              />
            </div>

            {/* Info */}
            <span className="product-tile-name">{product.name}</span>
            <span className="product-tile-description">{product.description}</span>
            <span className="product-tile-price">${product.price.toFixed(2)}</span>

            {/* CTA */}
            {product.quantity > 0 ? (
              <motion.button
                whileTap={{ scale: 0.93 }}
                className="product-tile-btn"
                onClick={(e) => handleAdd(e, product)}
              >
                <AnimatePresence mode="wait">
                  {addedIds.has(product._id) ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Check size={14} /> Added
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ) : (
              <span className="product-tile-soldout">Sold Out</span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
