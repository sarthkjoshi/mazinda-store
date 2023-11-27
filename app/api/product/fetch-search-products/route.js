import Product from "@/models/Product";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { searchQuery } = await req.json();

    try {
        await connectDB();

        // Split search query into individual words
        const searchWords = searchQuery.toLowerCase().split(/\s+/);

        // Use Mongoose $regex for case-insensitive partial matching
        const products = await Product.find({
            $or: searchWords.map(word => ({
                $or: [
                    { productName: { $regex: new RegExp(word, 'i') } },
                    // { description: { $regex: new RegExp(word, 'i') } }
                ]
            }))
        }).exec();

        // Calculate a relevance score for each product based on the number of matched words
        const productsWithScore = products.map(product => {
            const productNameLower = product.productName.toLowerCase();
            // const descriptionLower = product.description.toLowerCase();

            const score = searchWords.reduce((acc, word) => {
                if (productNameLower.includes(word)) {
                    return acc + 1;
                }
                return acc;
            }, 0);

            return { product, score };
        });

        // Sort products based on the score in descending order
        const sortedProducts = productsWithScore.sort((a, b) => b.score - a.score).map(entry => entry.product);

        return NextResponse.json({ success: true, products: sortedProducts });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ success: false, error: "An error occurred while fetching products: " + error });
    }
}