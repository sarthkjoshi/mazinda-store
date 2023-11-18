import Product from "@/models/Product";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const { productData } = await req.json();

        console.log(productData);

        await connectDB()

        let product = await Product.findOne({ _id: productData._id });

        if (product) {
            
            product.productName = productData.productName;
            product.category = productData.category;
            product.subcategory = productData.subcategory;
            product.pricing = productData.pricing;
            product.password = productData.password;
            product.imageURI = productData.imageURI;
            product.approvalStatus = productData.approvalStatus;
            product.trending = productData.trending;
            product.topDeal = productData.topDeal;
            product.isAvailable = productData.isAvailable;

            await product.save();
            return NextResponse.json({ success: true, message: "Product updated successfully" });
        } else {
            return NextResponse.json({ success: false, message: "Product doesn't exist" });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while fetching the product : " + error });
    }
}