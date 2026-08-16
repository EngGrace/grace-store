"use client";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";
import { ShoppingCart, Check } from "lucide-react";

type Variant = {
  label: string;
  spec: string;
  priceOffset: number;
};

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${resolvedParams.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found in database');
        return res.json();
      })
      .then((data) => {
        if (data && data.name) {
          setProduct(data);
        } else {
          setProduct(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading) {
    return <div className="container main-content" style={{ padding: "120px 0", textAlign: "center" }}>Loading...</div>;
  }

  if (!product) {
    return <div className="container main-content" style={{ padding: "120px 0", textAlign: "center" }}>Product not found.</div>;
  }

  // Build the list of options to render.
  // If the product has its own `variants` array, use that.
  // Otherwise fall back to a single default option built from the product itself.
  const variants: Variant[] =
    product.variants && product.variants.length > 0
      ? product.variants
      : [{ label: product.name, spec: "", priceOffset: 0 }];

  const hasMultipleOptions = variants.length > 1;
  const selected = variants[selectedIndex] || variants[0];
  const selectedPrice = product.price + (selected.priceOffset || 0);

  const handleAdd = () => {
    if (!product) return;

    const productToAdd = {
      ...product,
      _id: product._id + (selectedIndex > 0 ? `-${selectedIndex}` : ""),
      name: selected.label,
      price: selectedPrice,
    };

    addItem(productToAdd);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container main-content" style={{ padding: "40px 20px" }}>
      {/* Header section */}
      <div style={{ marginBottom: "40px", borderBottom: "1px solid var(--border)", paddingBottom: "20px", textAlign: "left" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "700", letterSpacing: "-0.02em", color: "var(--foreground)" }}>Buy {product.name}</h1>
        <p style={{ color: "var(--muted)", fontSize: "16px", marginTop: "8px" }}>
          From ${selectedPrice} or ${(selectedPrice / 24).toFixed(2)}/mo. for 24 mo.*
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
          {hasMultipleOptions && (
            <div>
              <h2 style={{ fontSize: "28px", fontWeight: "600" }}>
                <span style={{ color: "var(--muted)" }}>Which one is best for you?</span>
              </h2>
            </div>
          )}

          {hasMultipleOptions && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {variants.map((variant, index) => {
                const variantPrice = product.price + (variant.priceOffset || 0);
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={variant.label + index}
                    onClick={() => setSelectedIndex(index)}
                    style={{
                      border: isSelected ? "2px solid var(--primary)" : "2px solid var(--border)",
                      borderRadius: "16px",
                      padding: "24px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      boxShadow: isSelected ? "0 0 0 1px var(--primary)" : "none",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px", color: "var(--foreground)" }}>{variant.label}</h3>
                      {variant.spec && <p style={{ fontSize: "13px", color: "var(--muted)" }}>{variant.spec}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "14px", color: "var(--foreground)" }}>From ${variantPrice}</p>
                      <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>or ${(variantPrice / 24).toFixed(2)}/mo.<br />for 24 mo.*</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: hasMultipleOptions ? "20px" : "0" }}>
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