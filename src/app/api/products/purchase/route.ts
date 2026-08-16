import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { items } = await req.json(); // Array of { productId, cartQuantity }

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: "No items in cart" }, { status: 400 });
        }

        // Validate stock
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) return NextResponse.json({ success: false, message: `Product ${item.productId} not found` }, { status: 404 });
            if (product.quantity < item.cartQuantity) {
                return NextResponse.json({ success: false, message: `Not enough stock for product: ${product.name}` }, { status: 400 });
            }
        }

        // Decrement quantities
        for (const item of items) {
            const product = await Product.findById(item.productId);
            product.quantity -= item.cartQuantity;
            await product.save();
        }

        return NextResponse.json({ success: true, message: "Purchase completed successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Internal server error during purchase", error: error.message }, { status: 500 });
    }
}
