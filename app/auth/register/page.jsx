"use client";

import { useState } from "react";
import OvalLoader from "@/components/utility/OvalLoader";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";
import MazindaLogoFull from "@/public/logo_mazinda.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const RegisterStorePage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: "",
    storeName: "",
    address: "",
    city: "",
    pincode: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    email: "",
    password: "",
    acceptTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await axios.post("/api/auth/register-store", {
      formData,
    });
    const json = response.data;
    console.log(json)
    setIsSubmitting(false);

    if (json.success) {
      Cookies.set("store_token", json.store_token);
      toast.success(json.message, { autoClose: 3000 });
      router.push("/store");
    } else {
      toast.error(json.message, { autoClose: 3000 });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen my-4">
      <Image className="my-4" src={MazindaLogoFull} alt="mazinda" />
      <div className="max-w-md w-full p-2 bg-white rounded-lg">
        <h1 className="mb-1 text-center font-bold text-4xl">Register Store</h1>
        <div className="flex items-center justify-center mb-4">
          <p className="inline text-center text-gray-600">
            Or{" "}
            <Link
              href="/auth/login"
              className="text-gray-600 hover:underline"
            >
              Log in to store
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-10">
          <div className="mb-4">
            <label htmlFor="ownerName" className="block font-bold mb-1">
              Owner's Name
            </label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              className="w-full px-5 py-1 border rounded-full"
              placeholder="Enter owner's name"
              value={formData.ownerName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="storeName" className="block font-bold mb-1">
              Store Name
            </label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              className="w-full px-5 py-1 border rounded-full"
              placeholder="Enter store name"
              value={formData.storeName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block font-bold mb-1">
              Store Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="w-full px-5 py-1 border rounded-full"
              placeholder="Enter store address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4 flex">
            <div className="w-1/2 mr-2">
              <label htmlFor="city" className="block font-bold mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="w-full px-5 py-1 border rounded-full"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2 ml-2">
              <label htmlFor="pincode" className="block font-bold mb-1">
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                className="w-full px-5 py-1 border rounded-full"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-4 flex">
            <div className="w-1/2 mr-2">
              <label htmlFor="mobileNumber" className="block font-bold mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                className="w-full px-5 py-1 border rounded-full"
                value={formData.mobileNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2 ml-2">
              <label
                htmlFor="alternateMobileNumber"
                className="block font-bold mb-1"
              >
                Alternate Phone
              </label>
              <input
                type="text"
                id="alternateMobileNumber"
                name="alternateMobileNumber"
                className="w-full px-5 py-1 border rounded-full"
                value={formData.alternateMobileNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-5 py-1 border rounded-full"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-bold mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-5 py-1 border rounded-full"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                className="form-checkbox text-blue-500 h-5 w-5"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
              />
              <span className="ml-2 text-gray-700">
                I accept the Terms and Conditions
              </span>
            </label>
          </div>
          <div className="mb-4">
            <button
              disabled={!formData.acceptTerms}
              type="submit"
              className={`w-full ${
                formData.acceptTerms ? "bg-[#fe6321]" : "bg-gray-600"
              } text-white font-bold py-2 px-4 rounded-full ${
                formData.acceptTerms ? "hover:opacity-70" : ""
              }`}
            >
              {isSubmitting ? <OvalLoader /> : "Register"}
            </button>
          </div>
        </form>
      </div>
      <footer className="mt-8 text-center text-gray-500">
        &copy; 20xx-20xx All Rights Reserved | Privacy Policy | Terms of Service
      </footer>
    </div>
  );
};

export default RegisterStorePage;
