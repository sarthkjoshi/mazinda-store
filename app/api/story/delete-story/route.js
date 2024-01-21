import Story from "@/models/Story";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import Product from "@/models/Product";

export async function PUT(req) {
  try {
    const { story_id } = await req.json();

    // Connecting to database
    await connectDB();

    // Find and delete the story
    const story = await Story.findByIdAndDelete(story_id);

    if (!story) {
      return NextResponse.json({
        success: false,
        error:
          "An error occurred while deleting the story, story doesn't exist",
      });
    }

    // Find the associated product
    const product = await Product.findById(story.product._id);

    if (!product) {
      return NextResponse.json({
        success: false,
        error:
          "An error occurred while deleting the story, product doesn't exist",
      });
    }

    // Update the product to unset the specialPrice field
    const saveResult = await Product.findByIdAndUpdate(
      product._id,
      { $unset: { "pricing.specialPrice": 1 } },
      { new: true }
    );

    if (!saveResult) {
      return NextResponse.json({
        success: false,
        error: "An error occurred while updating the product",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while deleting the story: " + error,
    });
  }
}
