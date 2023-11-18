import Product from "@/models/Product";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectDB()

        let products = await Product.find()
        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while creating the Product : " + error });
    }
}