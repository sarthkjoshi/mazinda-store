import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  // fetch the authorisation token from the request headers
  const store_id = headers().get("Authorization");

  try {
    await connectDB();

    const store = await Store.findById(store_id);
    const bucket = store.productBucket;

    if (!store) {
      return NextResponse.json({
        success: false,
        message: "Store doesn't exist",
      });
    }

    return NextResponse.json({
      success: true,
      bucket,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching the bucket",
      error,
    });
  }
}
