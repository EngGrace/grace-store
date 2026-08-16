"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
    const [products, setProducts] = useState<any[]>([]);
    
    // Form state
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(""); // This will hold the Base64 string
    const [imagePreview, setImagePreview] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Fetch products on load
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    // Handle Image file selection and convert to Base64
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImage(base64String);
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // Validate image
        if (!image) {
            setMessage("Please select an image");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    price: Number(price),
                    category,
                    quantity: Number(quantity),
                    description,
                    image
                }),
            });

            if (res.ok) {
                setMessage("Product added successfully!");
                // Clear form
                setName("");
                setPrice("");
                setCategory("");
                setQuantity("");
                setDescription("");
                setImage("");
                setImagePreview("");
                
                // Refresh list
                fetchProducts();
            } else {
                setMessage("Failed to add product");
            }
        } catch (error) {
            console.error(error);
            setMessage("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                setProducts((prev) => prev.filter((p) => p._id !== id));
                setMessage(`"${name}" was deleted.`);
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("Failed to delete product.");
            }
        } catch {
            setMessage("An error occurred while deleting.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="container" style={{ padding: "40px 20px" }}>
            <h1 style={{ marginBottom: "20px" }}>Seller Dashboard</h1>

            {/* Add Product Form */}
            <div className="card" style={{ marginBottom: "40px" }}>
                <div className="card-body">
                    <h2 style={{ marginBottom: "20px" }}>Add New Product</h2>
                    {message && <p style={{ color: message.includes("success") ? "green" : "red", marginBottom: "15px" }}>{message}</p>}
                    
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                            
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Product Name</label>
                                <input 
                                    className="form-input" 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Price ($)</label>
                                <input 
                                    className="form-input" 
                                    type="number" 
                                    value={price} 
                                    onChange={(e) => setPrice(e.target.value)} 
                                    required 
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Category</label>
                                <select 
                                    className="form-input" 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)} 
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="phones">Phones</option>
                                    <option value="tablets">Tablets</option>
                                    <option value="accessories">Accessories</option>
                                    <option value="powerbanks">Power Banks</option>
                                    <option value="headsets">Headsets</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Quantity</label>
                                <input 
                                    className="form-input" 
                                    type="number" 
                                    value={quantity} 
                                    onChange={(e) => setQuantity(e.target.value)} 
                                    required 
                                    min="0"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Upload Image</label>
                                <input 
                                    className="form-input" 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload} 
                                    required 
                                />
                            </div>
                            
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Image Preview</label>
                                <div style={{ height: "60px", display: "flex", alignItems: "center" }}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" style={{ height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                                    ) : (
                                        <span style={{ color: "var(--muted)", fontSize: "14px" }}>No image selected</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea 
                                className="form-input" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                required 
                                rows={4}
                                style={{ resize: "vertical" }}
                            />
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                            <button className="btn-primary" type="submit" disabled={loading}>
                                {loading ? "Adding Product..." : "Add Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Existing Listings Grid */}
            <h2 style={{ marginBottom: "20px" }}>Your Listings</h2>
            <div className="grid">
                {products.length === 0 ? (
                    <p style={{ color: "var(--muted)" }}>No products listed yet.</p>
                ) : (
                    products.map((product) => (
                        <div key={product._id} className="card">
                            <img src={product.image} alt={product.name} className="card-image" />
                            <div className="card-body">
                                <h3 className="card-title">{product.name}</h3>
                                <p className="card-price">${product.price}</p>
                                <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "15px" }}>Stock: {product.quantity}</p>
                                <div style={{ display: "flex", gap: "6px" }}>
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 1, background: "var(--foreground)", color: "var(--background)", padding: "6px 14px", fontSize: "12px" }}
                                        disabled
                                    >
                                        Edit (Soon)
                                    </button>
                                    <button
                                        className="btn-primary"
                                        style={{
                                            flex: 1,
                                            background: "#ffffff",
                                            color: deletingId === product._id ? "#999" : "#d93025",
                                            border: `2px solid ${deletingId === product._id ? "#999" : "#d93025"}`,
                                            cursor: deletingId === product._id ? "not-allowed" : "pointer",
                                            padding: "6px 14px",
                                            fontSize: "12px",
                                        }}
                                        onClick={() => handleDelete(product._id, product.name)}
                                        disabled={deletingId === product._id}
                                    >
                                        {deletingId === product._id ? "Deleting…" : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
