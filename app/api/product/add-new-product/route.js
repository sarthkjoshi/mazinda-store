import Product from "@/models/Product";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { productData } = await req.json();
    const {
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
      variantId,
    } = productData;

    await connectDB();

    if (productData.variants && Object.keys(productData.variants).length) {
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
        variantId,
      });
    } else {
      await Product.create({
        productName,
        storeId,
        category,
        subcategory,
        imagePaths,
        pricing,
        description,
        tags,
      });
    }

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
