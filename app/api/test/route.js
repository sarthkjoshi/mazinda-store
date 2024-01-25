import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Connecting to database
    await connectDB();

    // Checking if the user already exists
    let stores = await Store.find();

    for (let store of stores) {
      store.businessType = ["b2c"];
      await store.save();
    }
    return NextResponse.json({
      success: true,
      message: "Stores updated successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while updating the stores : " + error,
    });
  }
}
