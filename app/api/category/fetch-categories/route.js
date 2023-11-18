import Category from "@/models/Category";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectDB()
        let categories = await Category.find()
        return NextResponse.json({ success: true, message: "Category fetched successfully", categories });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while creating the Category : " + error });
    }
}