"use client";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";
import { ShoppingCart, Check } from "lucide-react";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("pro");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${resolvedParams.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  const handleAdd = () => {
    if (!product) return;
    
    const productToAdd = {
      ...product,
      _id: product._id + (selectedModel === "max" ? "-max" : ""),
      name: selectedModel === "max" ? product.name + " Max" : product.name,
      price: selectedModel === "max" ? product.price + 100 : product.price,
    };
    
    addItem(productToAdd);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return <div className="container main-content" style={{ padding: "120px 0", textAlign: "center" }}>Loading...</div>;
  }

  if (!product) {
    return <div className="container main-content" style={{ padding: "120px 0", textAlign: "center" }}>Product not found.</div>;
  }

  return (
    <div className="container main-content" style={{ padding: "40px 20px" }}>
      {/* Header section */}
      <div style={{ marginBottom: "40px", borderBottom: "1px solid var(--border)", paddingBottom: "20px", textAlign: "left" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "700", letterSpacing: "-0.02em", color: "var(--foreground)" }}>Buy {product.name}</h1>
        <p style={{ color: "var(--muted)", fontSize: "16px", marginTop: "8px" }}>
          From ${product.price} or ${(product.price / 24).toFixed(2)}/mo. for 24 mo.*
        </p>
      </div>

      {/* Main split layout */}
      <div style={{ display: "flex", gap: "60px", flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Left Image Section */}
        <div style={{ flex: "1 1 500px", background: "#f5f5f7", borderRadius: "24px", padding: "40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "500px" }}>
          <div style={{ position: "relative", width: "100%", height: "450px" }}>
            <Image 
              src={product.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"} 
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Right Details Section */}
        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "32px" }}>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "600" }}>
              <span style={{ color: "var(--foreground)" }}>Model.</span>{" "}
              <span style={{ color: "var(--muted)" }}>Which is best for you?</span>
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Option 1 */}
            <div 
              onClick={() => setSelectedModel("pro")}
              style={{ 
                border: selectedModel === "pro" ? "2px solid var(--primary)" : "2px solid var(--border)", 
                borderRadius: "16px", 
                padding: "24px", 
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxShadow: selectedModel === "pro" ? "0 0 0 1px var(--primary)" : "none",
              }}
            >
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px", color: "var(--foreground)" }}>{product.name}</h3>
                <p style={{ fontSize: "13px", color: "var(--muted)" }}>6.3-inch display</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "14px", color: "var(--foreground)" }}>From ${product.price}</p>
                <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>or ${(product.price / 24).toFixed(2)}/mo.<br/>for 24 mo.*</p>
              </div>
            </div>

            {/* Option 2 */}
            <div 
              onClick={() => setSelectedModel("max")}
              style={{ 
                border: selectedModel === "max" ? "2px solid var(--primary)" : "2px solid var(--border)", 
                borderRadius: "16px", 
                padding: "24px", 
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxShadow: selectedModel === "max" ? "0 0 0 1px var(--primary)" : "none",
              }}
            >
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px", color: "var(--foreground)" }}>{product.name} Max</h3>
                <p style={{ fontSize: "13px", color: "var(--muted)" }}>6.9-inch display</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "14px", color: "var(--foreground)" }}>From ${product.price + 100}</p>
                <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>or ${((product.price + 100) / 24).toFixed(2)}/mo.<br/>for 24 mo.*</p>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: "20px" }}>
            <button 
              className="btn-primary" 
              style={{ 
                width: "100%", 
                padding: "18px", 
                fontSize: "18px", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                gap: "12px",
                background: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600"
              }}
              onClick={handleAdd}
            >
              {added ? <><Check size={20} /> Added to Bag</> : <><ShoppingCart size={20} /> Add to Bag</>}
            </button>
          </div>
          
          <div style={{ background: "#f5f5f7", borderRadius: "16px", padding: "24px", marginTop: "16px" }}>
             <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "var(--foreground)" }}>Need help choosing a model?</h4>
             <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: "1.6" }}>
               {product.description || "Explore the differences in screen size and battery life."}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
