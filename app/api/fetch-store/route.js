import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req) {
  try {
    const { user } = await getServerSession(authOptions);

    const mobileNumber = user.mobileNumber;

    // Connecting to database
    await connectDB();

    // Checking if the user already exists
    let store = await Store.findOne({ mobileNumber });

    if (store) {
      return NextResponse.json({
        success: true,
        message: "Store fetched successfully",
        store,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Store doesn't exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the store : " + error,
    });
  }
}
