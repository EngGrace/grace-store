import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

const sampleProducts = [
  {
    name: "UltraBook Pro 15",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    category: "Laptops",
    description: "High-performance laptop featuring a sleek aluminum design, 4K Retina Display, 32GB RAM, and 1TB SSD.",
    quantity: 15,
  },
  {
    name: "CyberPhone X Max",
    price: 999.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    category: "Smartphones",
    description: "Next-gen flagship smartphone with OLED 120Hz display, triple lens 108MP camera, and 5G ultra connectivity.",
    quantity: 25,
  },
  {
    name: "SonicPro Wireless ANC Headphones",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    category: "Audio",
    description: "Premium over-ear wireless headphones with active noise cancellation, deep bass, and 40-hour battery life.",
    quantity: 40,
  },
  {
    name: "PulseFit Smartwatch 4",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    category: "Wearables",
    description: "Advanced fitness smartwatch featuring heart rate monitoring, SPO2 tracking, GPS, and water resistance.",
    quantity: 30,
  },
  {
    name: "VisionGrid 4K Curved Monitor 34\"",
    price: 649.99,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    category: "Monitors",
    description: "Ultra-wide 34-inch 144Hz curved gaming monitor with HDR 400 and ultra-fast 1ms response time.",
    quantity: 10,
  },
  {
    name: "MechStrike RGB Mechanical Keyboard",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    description: "Custom mechanical gaming keyboard with hot-swappable tactile switches and per-key RGB lighting.",
    quantity: 50,
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Check existing products count
    const count = await Product.countDocuments();
    if (count > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already has ${count} products.`,
        count
      });
    }

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${inserted.length} sample electronic gadgets into MongoDB.`,
      products: inserted
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Database seed failed",
      error: error.message
    }, { status: 500 });
  }
}
