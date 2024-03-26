import BulkUploadRequest from "@/models/BulkUploadRequest";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { storeId, storeName, products } = await req.json();
  try {
    await connectDB();

    await BulkUploadRequest.create({
      storeId,
      storeName,
      requestProducts: products,
    });

    return NextResponse.json({
      success: true,
      message: "Bulk upload request created successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while creating the bulk upload request",
      error,
    });
  }
}
