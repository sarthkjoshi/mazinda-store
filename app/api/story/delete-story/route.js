import Story from "@/models/Story";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Product from "@/models/Product";

export async function PUT(req) {
  try {
    const { story_id } = await req.json();

    // Connecting to database
    await connectDB();

    const story = await Story.findByIdAndDelete(story_id);

    if (!story) {
      return NextResponse.json({
        success: false,
        error:
          "An error occurred while deleting the story, story doesn't exist : " +
          error,
      });
    }

    const product = await Product.findById(story.product._id);

    if (!story) {
      return NextResponse.json({
        success: false,
        error:
          "An error occurred while deleting the story, product doesn't exist : " +
          error,
      });
    }

    delete product.pricing.specialPrice;
    await product.save();

    return NextResponse.json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while deleting the story : " + error,
    });
  }
}
