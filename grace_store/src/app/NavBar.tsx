"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const { totalItems } = useCart();
  const pathname = usePathname();

  return (
    <nav>
      <div style={{ fontWeight: 700, fontSize: '18px' }}>
        <Link href="/">Grace Store</Link>
      </div>
      <div className="nav-links">
        <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>Home</Link>
        <Link href="/products" className={`nav-link ${pathname.startsWith("/products") ? "active" : ""}`}>Products</Link>
        <Link href="/cart" className={`nav-link ${pathname.startsWith("/cart") ? "active" : ""}`} style={{ position: "relative" }}>
          Cart
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                style={{
                  position: "absolute",
                  top: -8,
                  right: -16,
                  background: "var(--primary)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <Link href="/checkout" className={`nav-link ${pathname.startsWith("/checkout") ? "active" : ""}`}>Checkout</Link>
        <Link href="/dashboard" className={`nav-link ${pathname.startsWith("/dashboard") ? "active" : ""}`}>Dashboard</Link>
      </div>
    </nav>
  );
}
