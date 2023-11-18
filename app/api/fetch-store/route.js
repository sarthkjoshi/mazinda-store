import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const { store_token } = await req.json();
        const data = jwt.verify(store_token, 'this is jwt secret')

        const mobileNumber = data.mobileNumber
        
        // Connecting to database
        await connectDB()

        // Checking if the user already exists
        let store = await Store.findOne({ mobileNumber });

        if (store) {
            return NextResponse.json({ success: true, message: "Store fetched successfully", store});
        } else {
            return NextResponse.json({ success: false, message: "Store doesn't exist" });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while fetching the store : " + error });
    }
}
