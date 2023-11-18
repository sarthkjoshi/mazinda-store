import Store from "@/models/Store";
import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

// import CryptoJS from "crypto-js";

export async function POST(req) {
    try {
        const { formData } = await req.json();
        const { ownerName, storeName, address, city, pincode, mobileNumber, alternateMobileNumber, email, password } = formData;
        await connectDB()
        let store = await Store.findOne({ mobileNumber })

        if (!store) {
            const newStore = await Store.create({ ownerName, storeName, mobileNumber, alternateMobileNumber, email, password, storeAddress: { address, city, pincode } });

            const store_token = jwt.sign({ id: newStore._id, storeName, mobileNumber, email }, 'this is jwt secret')
            // await Vendor.create({ name, number, alternateNumber, password: CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString(), deliveryLocations, deliveryCharges, foodTypes });
            return NextResponse.json({ success: true, message: "Store created successfully", store_token });
        }

        else {
            return NextResponse.json({ success: false, message: "Store already exists" });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while creating the Store : " + error });
    }
}