import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req) {
  const { index } = await req.json();

  try {
    const data = await getServerSession(authOptions);
    const id = data.user.id;
    await connectDB();

    let store = await Store.findById(id);

    if (index < 0 || index >= store.productBucket.length) {
      return NextResponse.json({ success: false, message: "Invalid index" });
    }

    store.productBucket.splice(index, 1);
    await store.save();
    return NextResponse.json({
      success: true,
      message: "Item deleted from bucket",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching the buckets" + error,
      error,
    });
  }
}
