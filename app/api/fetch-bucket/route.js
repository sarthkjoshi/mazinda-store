import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  try {
    const data = await getServerSession(authOptions);
    const id = data.user.id;
    await connectDB();

    const store = await Store.findById({ _id: id });
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
