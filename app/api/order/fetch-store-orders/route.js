import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import Order from "@/models/Order";

export async function POST(req) {
    try {
        const { storeToken } = await req.json();

        const storeData = jwt.verify(storeToken, 'this is jwt secret');

        await connectDB()

        let store = await Store.findOne({ mobileNumber: storeData.mobileNumber })
        if (!store) {
            return NextResponse.json({ success: false, error: "store doesn't exists" });
        }
        let undeliveredOrders = await Order.find({ status: { $ne: "Delivered" } });
        let storeOrders = [];
        let newCart = [];

        undeliveredOrders.map(order => {

            // Adding store specific items only in the cart of storeOrder
            order.cart.map(product => {
                if(product.storeID === storeData.id) {
                    newCart.push(product);
                }
            })
            
            order.cart = newCart;
            if(newCart.length){
                storeOrders.push(order); // This order now contains the filtered cart.
            }
            newCart = [];
        })

        return NextResponse.json({ success: true, message: "Current orders fetched successfully", currentOrders: storeOrders });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while fetching the products : " + error });
    }
}