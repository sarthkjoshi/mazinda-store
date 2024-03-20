import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";

import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(req) {
  try {
    const { user } = await getServerSession(authOptions);

    const mobileNumber = user.mobileNumber;

    await connectDB();

    let store = await Store.findOne({ mobileNumber: mobileNumber });

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
