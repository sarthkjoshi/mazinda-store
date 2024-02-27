import BulkUploadRequest from "@/models/BulkUploadRequest";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { storeId, storeName, filePath } = await req.json();
  try {
    await connectDB();

    await BulkUploadRequest.create({ storeId, storeName, filePath });

    return NextResponse.json({
      success: true,
      message: "Bulk upload request created successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while creating the bulk upload request",
      error,
    });
  }
}
