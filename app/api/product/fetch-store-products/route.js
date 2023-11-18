import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
    const { storeToken } = await req.json()

    const storeData = jwt.verify(storeToken, 'this is jwt secret');
    const storeId = storeData['id']
    
    try {
        await connectDB()
        const products = await Product.find({ storeId });
        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while logging in the Product : " + error });
    }
}