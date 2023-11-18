import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const { credentials } = await req.json();
        const { identifier, password } = credentials;

        // Connecting to database
        await connectDB()

        // Checking if the Store already exists
        let store = await Store.findOne({ mobileNumber: identifier });

        if (store) {

            if (store.password === password) {
                const store_token = jwt.sign({ id: store._id, storeName: store.storeName, mobileNumber: store.mobileNumber, email: store.email }, 'this is jwt secret')
                return NextResponse.json({ success: true, message: "Store logged in successfully", store_token });
            } else {
                return NextResponse.json({ success: false, message: "Invalid credentials" });
            }
        } else {
            return NextResponse.json({ success: false, message: "Store doesn't exist" });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while logging in the Store : " + error });
    }
}