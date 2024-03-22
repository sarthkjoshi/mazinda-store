import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(req) {
  try {
    const { user } = await getServerSession(authOptions);

    const storeId = user.id;

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
