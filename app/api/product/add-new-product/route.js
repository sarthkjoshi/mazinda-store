import Product from "@/models/Product";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { productData } = await req.json();
    const {
      productName,
      storeToken,
      category,
      subcategory,
      imagePaths,
      pricing,
      description,
      tags,
      variants,
      variantsInfo,
      combinationName,
    } = productData;

    const storeData = jwt.verify(storeToken, "this is jwt secret");
    const storeId = storeData["id"];

    await connectDB();

    await Product.create({
      productName,
      storeId,
      category,
      subcategory,
      imagePaths,
      pricing,
      description,
      tags,
      variants,
      variantsInfo,
      combinationName,
    });
    return NextResponse.json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while creating the Product : " + error,
    });
  }
}
