import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
    try {
        await connectToDatabase();
        const products = await Product.find();
        return NextResponse.json(products);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Failed to fetch products", error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const product = await Product.create(body);
        return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error }, { status: 400 });
    }
}
