import Story from "@/models/Story";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { story_id } = await req.json();

    // Connecting to database
    await connectDB();

    // Checking if the Vendor already exists
    await Story.findByIdAndDelete(story_id);

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
