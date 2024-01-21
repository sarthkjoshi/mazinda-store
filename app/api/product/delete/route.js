import Product from "@/models/Product";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const { _id } = await req.json();

        await connectDB()

        await Product.findByIdAndDelete(_id);
        
        return NextResponse.json({ success: true, message: "Successfully deleted the product" });

    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while updating the product : " + error });
    }
}