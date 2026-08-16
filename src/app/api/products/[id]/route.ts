import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const resolvedParams = await params;
        const product = await Product.findById(resolvedParams.id);
        if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Failed to fetch product", error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const resolvedParams = await params;
        const body = await req.json();
        const product = await Product.findByIdAndUpdate(resolvedParams.id, body, { new: true });
        if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Failed to update product", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const resolvedParams = await params;
        const deletedProduct = await Product.findByIdAndDelete(resolvedParams.id);
        if (!deletedProduct) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        return NextResponse.json({ success: true, message: "Product deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Failed to delete product", error: error.message }, { status: 500 });
    }
}
