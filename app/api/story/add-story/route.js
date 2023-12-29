import Story from "@/models/Story";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { product, specialPrice, storeDetails, isSponsored } =
      await req.json();

    await connectDB();

    await Story.create({
      product,
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
