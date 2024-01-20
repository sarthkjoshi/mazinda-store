import Story from "@/models/Story";
import Product from "@/models/Product";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { product, specialPrice, storeDetails, isSponsored } =
      await req.json();

    await connectDB();

    const fetchedProduct = await Product.findById(product._id);

    if (!fetchedProduct) {
      return NextResponse.json({
        success: false,
        error: "An error occurred while adding the story, product not found",
      });
    }

    fetchedProduct.pricing.specialPrice = specialPrice;
    await fetchedProduct.save();

    await Story.create({
      product: fetchedProduct,
      storeDetails,
      specialPrice,
      isSponsored,
    });

    return NextResponse.json({
      success: true,
      message: "Story added successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while adding the story : " + error,
    });
  }
}
