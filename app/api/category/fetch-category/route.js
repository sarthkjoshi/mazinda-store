import Category from "@/models/Category";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { id } = await req.json();
    try {
        await connectDB()
        let category = await Category.findById(id);
        return NextResponse.json({ success: true, message: "Category fetched successfully", category });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while creating the Category : " + error });
    }
}