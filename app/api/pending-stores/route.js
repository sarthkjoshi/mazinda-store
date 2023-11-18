import connectDB from "@/libs/mongoose";
import Store from "@/models/Store";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectDB()
        const pendingStores = await Store.countDocuments({ approvedStatus: 'pending' })
        return NextResponse.json({ success: true, pendingStores });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while logging in the Store : " + error });
    }
}