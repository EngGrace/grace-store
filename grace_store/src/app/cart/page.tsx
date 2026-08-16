"use client";
import { useCart } from "@/lib/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQty, totalItems, totalPrice, clearCart } = useCart();

  return (
    <div className="container" style={{ padding: "40px 20px", maxWidth: 900 }}>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 40, marginBottom: 10, textAlign: "center" }}
      >
        Your Cart
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{ textAlign: "center", color: "var(--muted)", marginBottom: 40, fontSize: 16 }}
      >
        {totalItems === 0
          ? "Your cart is empty"
          : `${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart`}
      </motion.p>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "var(--surface)",
            borderRadius: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
          }}
        >
          <ShoppingBag size={72} color="var(--border)" style={{ marginBottom: 24 }} />
          <h3 style={{ fontSize: 22, marginBottom: 10, color: "var(--foreground)" }}>
            Nothing here yet
          </h3>
          <p style={{ color: "var(--muted)", marginBottom: 30 }}>
            Browse our collection and add items you love.
          </p>
          <Link href="/products" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
            Explore Products
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Cart Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    background: "var(--surface)",
                    borderRadius: 18,
                    padding: 16,
                    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Product Image */}
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"}
                    alt={item.name}
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 14,
                      objectFit: "cover",
                      background: "#f5f5f7",
                      flexShrink: 0,
                    }}
                  />

                  {/* Product Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: 15, fontWeight: 500, color: "var(--primary)" }}>
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "#f5f5f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid var(--border)",
                      }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={15} />
                    </motion.button>
                    <span style={{ width: 30, textAlign: "center", fontWeight: 600, fontSize: 16 }}>
                      {item.qty}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      disabled={item.qty >= item.maxQty}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: item.qty >= item.maxQty ? "#f0f0f0" : "#f5f5f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid var(--border)",
                        opacity: item.qty >= item.maxQty ? 0.4 : 1,
                        cursor: item.qty >= item.maxQty ? "not-allowed" : "pointer",
                      }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={15} />
                    </motion.button>
                  </div>

                  {/* Line Total */}
                  <span style={{ fontWeight: 600, fontSize: 16, minWidth: 80, textAlign: "right" }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>

                  {/* Remove Button */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ background: "#fee2e2" }}
                    onClick={() => removeItem(item._id)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#fef2f2",
                      flexShrink: 0,
                    }}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              marginTop: 32,
              background: "var(--surface)",
              borderRadius: 24,
              padding: "32px 28px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 15, color: "var(--muted)" }}>
              <span>Subtotal ({totalItems} items)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 15, color: "var(--muted)" }}>
              <span>Shipping</span>
              <span style={{ color: "#34A853", fontWeight: 500 }}>Free</span>
            </div>
            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: 16,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={clearCart}
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  borderRadius: 99,
                  background: "transparent",
                  border: "1px solid var(--border)",
                  fontWeight: 500,
                  fontSize: 15,
                  color: "var(--foreground)",
                }}
              >
                Clear Cart
              </motion.button>
              <Link
                href="/checkout"
                className="btn-primary"
                style={{
                  flex: 2,
                  padding: "14px 20px",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
