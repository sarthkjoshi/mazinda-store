import Product from "@/models/Product";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { productData } = await req.json();
        const { productName, storeToken, category, subcategory, imagePaths, pricing, description } = productData;

        const storeData = jwt.verify(storeToken, 'this is jwt secret');
        const storeId = storeData['id']

        await connectDB()
        let product = await Product.findOne({ storeId, productName })

        if (!product) {
            await Product.create({ productName, storeId, category, subcategory, imagePaths, pricing, description });
            return NextResponse.json({ success: true, message: "Product created successfully" });
        }

        else {
            return NextResponse.json({ success: false, message: "Product already exists" });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while creating the Product : " + error });
    }
}