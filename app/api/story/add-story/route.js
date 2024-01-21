import Story from "@/models/Story";
import Product from "@/models/Product";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { product, specialPrice, storeDetails, isSponsored } =
      await req.json();

    await connectDB();

    // Fetch the product and update the specialPrice field
    const fetchedProduct = await Product.findByIdAndUpdate(
      product._id,
      { $set: { "pricing.specialPrice": specialPrice } },
      { new: true } // This option returns the modified document
    );

    // Check if the product was found
    if (!fetchedProduct) {
      return NextResponse.json({
        success: false,
        error: "An error occurred while adding the story, product not found",
      });
    }

    // Create the Story with the updated product details
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
