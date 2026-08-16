"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, LogIn } from "lucide-react";

export default function NavBar() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", background: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
      <div style={{ fontWeight: 500, fontSize: "1.25rem", color: "#0f172a" }}>
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>Grace Store</Link>
      </div>

      <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
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
                  background: "#2563eb",
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

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "#f1f5f9", padding: "0.4rem 0.8rem", borderRadius: "20px", fontSize: "0.875rem", fontWeight: "600", color: "#334155" }}>
              <User size={16} color="#2563eb" />
              <span>{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "0.4rem 0.75rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.85rem",
                color: "#64748b",
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link
              href="/login"
              style={{
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <LogIn size={16} /> Sign In
            </Link>
            <Link
              href="/register"
              style={{
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#ffffff",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
              }}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

