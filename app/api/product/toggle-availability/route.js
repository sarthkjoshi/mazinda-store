import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { id } = await req.json();
  try {
    await connectDB();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({
        success: false,
        error: "Product doesn't exist" + error,
      });
    }
    product.isAvailable = !product.isAvailable;
    await product.save();
    return NextResponse.json({
      success: true,
      message: "Product availablity toggled successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while logging in the Product : " + error,
    });
  }
}
