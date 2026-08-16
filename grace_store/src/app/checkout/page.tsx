"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function Checkout() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState<"Visa" | "Mastercard" | "Unknown" | "">("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const value = cardNumber.replace(/\s+/g, '');
    if (value.length === 0) {
      setCardType("");
      setError("");
      return;
    }
    
    if (value.startsWith("4")) {
      setCardType("Visa");
    } else if (value.startsWith("5")) {
      setCardType("Mastercard");
    } else {
      setCardType("Unknown");
      setError("Unsupported network. Visa or Mastercard only.");
    }

    if (value.length > 0 && value.length !== 16) {
      if (cardType === "Unknown") {
        setError("Unsupported network and must be 16 digits.");
      } else {
        setError(`Card must be 16 digits (currently ${value.length}).`);
      }
    } else if (cardType !== "Unknown") {
      setError("");
    }
  }, [cardNumber, cardType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = cardNumber.replace(/\s+/g, '');
    if (value.length !== 16 || cardType === "Unknown") {
      alert("Invalid payment details.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/products/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i._id, cartQuantity: i.qty })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Purchase failed. Please try again.");
        setSubmitting(false);
        return;
      }

      clearCart();
      setSuccess(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  // If cart is empty and not showing success
  if (items.length === 0 && !success) {
    return (
      <div className="container" style={{ maxWidth: 600, padding: '60px 20px', textAlign: 'center' }}>
        <ShoppingBag size={72} color="var(--border)" style={{ marginBottom: 24 }} />
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Your cart is empty</h2>
        <p style={{ color: "var(--muted)", marginBottom: 30 }}>Add some products before checking out.</p>
        <Link href="/products" className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 600, padding: '60px 20px' }}>
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <h2 style={{ marginBottom: 30, fontSize: 32 }}>Secure Checkout</h2>

            {/* Order Summary */}
            <div style={{
              background: "#f5f5f7",
              borderRadius: 16,
              padding: "20px 24px",
              marginBottom: 24,
            }}>
              <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--muted)" }}>
                Order Summary
              </h4>
              {items.map(item => (
                <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"} 
                      alt={item.name} 
                      style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} 
                    />
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</span>
                      <span style={{ fontSize: 13, color: "var(--muted)", marginLeft: 8 }}>×{item.qty}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, fontSize: 17, fontWeight: 700 }}>
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} style={{ background: "var(--surface)", padding: 40, borderRadius: 24, boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" required placeholder="John Doe" />
              </div>
              
              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">Card Number</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard color="var(--muted)" style={{ position: 'absolute', left: 16, top: 18 }} size={20} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: 46 }}
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456" 
                    required 
                  />
                </div>
                
                <AnimatePresence>
                  {cardType === "Visa" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ color: "#1A1F71", fontWeight: 700, marginTop: 8, fontSize: 13, display: 'flex', alignItems: 'center' }}>
                      <CheckCircle2 size={16} style={{ marginRight: 6 }}/> Visa Recognized
                    </motion.div>
                  )}
                  {cardType === "Mastercard" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ color: "#EB001B", fontWeight: 700, marginTop: 8, fontSize: 13, display: 'flex', alignItems: 'center' }}>
                      <CheckCircle2 size={16} style={{ marginRight: 6 }}/> Mastercard Recognized
                    </motion.div>
                  )}
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ color: "#d93025", fontWeight: 500, marginTop: 8, fontSize: 13, display: 'flex', alignItems: 'center' }}>
                      <AlertCircle size={16} style={{ marginRight: 6 }}/> {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ display: 'flex', gap: 20 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Expiry</label>
                  <input type="text" className="form-input" required placeholder="MM/YY" />
                </div>
                <div className="form-group" style={{ width: 120 }}>
                  <label className="form-label">CVV</label>
                  <input type="text" className="form-input" required placeholder="123" />
                </div>
              </div>

              <motion.button 
                whileHover={!submitting ? { scale: 1.02 } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
                className="btn-primary" 
                type="submit"
                style={{ width: '100%', marginTop: 20, padding: 16, fontSize: 16 }}
                disabled={!!error || cardNumber.length === 0 || submitting}
              >
                {submitting ? "Processing…" : `Pay $${totalPrice.toFixed(2)}`}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '80px 20px' }}
          >
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle2 size={80} color="#34A853" style={{ margin: '0 auto 24px auto' }} />
            </motion.div>
            <h2 style={{ fontSize: 32, marginBottom: 16 }}>Order Confirmed!</h2>
            <p style={{ color: "var(--muted)", fontSize: 18, marginBottom: 30 }}>Thank you for shopping at Grace Store.</p>
            <Link href="/products" className="btn-primary">Continue Shopping</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
