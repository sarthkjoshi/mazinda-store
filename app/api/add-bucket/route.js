import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req) {
  try {
    const { productName, imagePath, naaam } = await req.json();
    console.log(productName, imagePath, naaam);
    const data = await getServerSession(authOptions);
    const id = data.user.id;
    await connectDB();

    const productBucket = {
      productName: productName,
      imagePath: imagePath,
    };
    const updatedStore = await Store.findById({ _id: id });
    updatedStore.productBucket.push(productBucket);
    updatedStore.save();
    if (!updatedStore) {
      return NextResponse.json({
        success: false,
        message: "Store doesn't exist",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Product added to bucket successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the store : " + error,
    });
  }
}
