import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

import Order from "@/models/Order";

export async function POST(req) {
  const { storeId } = await req.json();
  try {
    await connectDB();

    let store = await Store.findById(storeId);

    if (!store) {
      return NextResponse.json({
        success: false,
        error: "store doesn't exists",
      });
    }

    let undeliveredOrders = await Order.find({ status: { $ne: "Delivered" } });
    let storeOrders = [];
    let newCart = [];

    undeliveredOrders.map((order) => {
      // Adding store specific items only in the cart of storeOrder
      order.cart.map((product) => {
        if (product.storeId === store.id) {
          newCart.push(product);
        }
      });

      order.cart = newCart;
      if (newCart.length) {
        storeOrders.push(order); // This order now contains the filtered cart.
      }
      newCart = [];
    });

    return NextResponse.json({
      success: true,
      message: "Current orders fetched successfully",
      currentOrders: storeOrders,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the products : " + error,
    });
  }
}
