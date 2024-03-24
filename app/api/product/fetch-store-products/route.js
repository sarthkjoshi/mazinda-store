import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { storeId } = await req.json();
  try {
    await connectDB();
    const products = await Product.find({ storeId });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while logging in the Product : " + error,
    });
  }
}
