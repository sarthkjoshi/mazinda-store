import connectDB from "@/libs/mongoose";
import Store from "@/models/Store";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { id } = await req.json()
    try {
        await connectDB()
        const store = await Store.findById(id)
        if (!store) {
            return NextResponse.json({ success: false, error: "Store doesn't exist" + error });
        }
        return NextResponse.json({ success: true, store });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while logging in the Store : " + error });
    }
}