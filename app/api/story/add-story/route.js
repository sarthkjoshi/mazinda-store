import Story from "@/models/Story";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { product, specialPrice, store_token, isSponsored } =
      await req.json();

    const storeData = jwt.verify(store_token, "this is jwt secret");
    const storeId = storeData["id"];

    await connectDB();

    await Story.create({
      product,
      storeId,
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
