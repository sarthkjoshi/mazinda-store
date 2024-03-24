"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OvalLoader from "@/components/utility/OvalLoader";
import MazindaLogoFull from "@/public/logo_mazinda.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  let router;
  try {
    router = useRouter();
  } catch (e) {
    console.log(e);
  }

  const [submitting, setSubmitting] = useState(false);
  const [credentials, setCredentials] = useState({
    phone: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await signIn("credentials", {
      ...credentials,
      redirect: false,
    });
    if (res.status == 200) {
      router.push("/");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-5">
      <Image
        className="mt-8 mb-4 h-10 object-contain"
        src={MazindaLogoFull}
        alt="Mazinda Logo"
      />
      <div className="w-full max-w-md p-6 bg-white rounded-md border border-gray-200">
        <h1 className="mb-1 text-center font-bold text-3xl">Store Login</h1>
        <div className="flex items-center justify-center">
          <p className="inline text-center text-gray-600">
            Or{" "}
            <Link
              href="/auth/register"
              className="text-gray-600 hover:underline"
            >
              Register Store
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="my-5">
          <div className="mb-4">
            <Label htmlFor="phone">Phone</Label>
            <Input
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter your phone"
              value={credentials.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4 text-right">
            <a href="#" className="text-gray-700 hover:underline text-sm">
              Forgot Password?
            </a>
          </div>
          <div className="mb-4">
            <Button type="submit" className="w-full font-bold hover:opacity-70">
              {submitting ? <OvalLoader /> : "Login"}
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

export default LoginPage;
