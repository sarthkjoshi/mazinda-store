"use client";

import { useState } from "react";
import OvalLoader from "@/components/utility/OvalLoader";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";
import MazindaLogoFull from "@/public/logo_mazinda.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const RegisterStorePage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: "",
    storeName: "",
    address: "",
    city: "",
    pincode: "",
    businessType: [],
    gstin: "",
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

    const response = await axios.post("/api/register-store", {
      formData,
    });
    const json = response.data;
    setIsSubmitting(false);

    if (json.success) {
      toast.success(json.message, { autoClose: 3000 });
      router.push("/auth/login");
    } else {
      toast.error(json.message, { autoClose: 3000 });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-5">
      <Image
        className="mt-8 mb-4 h-10 object-contain"
        src={MazindaLogoFull}
        alt="Mazinda Logo"
      />
      <div className="w-full max-w-md p-6 bg-white rounded-md border border-gray-200">
        <h1 className="mb-1 text-center font-bold text-3xl">Register Store</h1>
        <div className="flex items-center justify-center">
          <p className="inline text-center text-gray-600">
            Or{" "}
            <Link href="/auth/login" className="text-gray-600 hover:underline">
              Log in to store
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="mb-4">
            <Label htmlFor="ownerName">Owner's Name</Label>
            <Input
              type="text"
              id="ownerName"
              name="ownerName"
              placeholder="Enter owner's name"
              value={formData.ownerName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              type="text"
              id="storeName"
              name="storeName"
              placeholder="Enter store name"
              value={formData.storeName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="address">Store Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              placeholder="Enter store address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4 flex">
            <div className="w-1/2 mr-2">
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-1/2 ml-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                type="text"
                id="pincode"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="my-5">
            <Label>Business Type</Label>

            <div className="flex items-center space-x-2 mt-3 mb-2">
              <Checkbox
                id="b2c"
                checked={formData.businessType.includes("b2c")}
                onCheckedChange={() => {
                  setFormData({
                    ...formData,
                    businessType: formData.businessType.includes("b2c")
                      ? formData.businessType.filter((type) => type !== "b2c")
                      : [...formData.businessType, "b2c"],
                  });
                }}
              />
              <label
                htmlFor="b2c"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Business To Customer
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="b2b"
                checked={formData.businessType.includes("b2b")}
                onCheckedChange={() => {
                  setFormData({
                    ...formData,
                    businessType: formData.businessType.includes("b2b")
                      ? formData.businessType.filter((type) => type !== "b2b")
                      : [...formData.businessType, "b2b"],
                  });
                }}
              />
              <label
                htmlFor="b2b"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Business To Business
              </label>
            </div>
          </div>

          {formData.businessType.includes("b2b") ? (
            <div className="mb-4">
              <Label>GSTIN</Label>
              <Input
                type="text"
                id="gstin"
                name="gstin"
                placeholder="Enter the GST Number of the business"
                value={formData.gstin}
                onChange={handleInputChange}
                required
              />
            </div>
          ) : null}

          <div className="mb-4 flex">
            <div className="w-1/2 mr-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-1/2 ml-2">
              <Label htmlFor="alternateMobileNumber">Alternate Phone</Label>
              <Input
                type="tel"
                id="alternateMobileNumber"
                name="alternateMobileNumber"
                value={formData.alternateMobileNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="my-12">
            <Label className="flex items-center cursor-pointer">
              <Input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                className="form-checkbox text-blue-500 h-5 w-5"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                required
              />
              <span className="ml-2 text-gray-700">
                I accept the Terms and Conditions
              </span>
            </Label>
          </div>
          <div className="mb-4">
            <Button
              disabled={!formData.acceptTerms}
              type="submit"
              className={`w-full ${
                formData.acceptTerms ? "bg-[#fe6321]" : "bg-gray-300"
              } text-white font-bold py-2 px-4 ${
                formData.acceptTerms ? "hover:opacity-70" : ""
              }`}
            >
              {isSubmitting ? <OvalLoader /> : "Register"}
            </Button>
          </div>
        </form>
      </div>
      <footer className="mt-5 text-center text-sm text-gray-800">
        <span className="text-gray-500">&copy; 2024 All Rights Reserved</span>
        <br />
        <b>Privacy Policy</b> | <b>Terms of Service</b>
      </footer>
    </div>
  );
};

export default RegisterStorePage;
