"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import OvalLoader from "@/components/utility/OvalLoader";
import MazindaLogoFull from "@/public/logo_mazinda.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  let router;
  try {
    router = useRouter();
  } catch (e) {
    console.log(e);
  }

  const store_token = Cookies.get("store_token");
  if (store_token) {
    router.push("/");
  }

  const [submitting, setSubmitting] = useState(false);
  const [credentials, setCredentials] = useState({
    identifier: "",
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

    const { data } = await axios.post("/api/auth/login-store", {
      credentials,
    });

    console.log(data);
    if (data.success) {
      Cookies.set("store_token", data.store_token, { expires: 1000 });
      router.push(`/store`);
    } else {
      toast.error(data.message, { autoClose: 3000 });
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image className="my-4" src={MazindaLogoFull} alt="Mazinda Logo" />
      <div className="max-w-md w-full p-6 bg-white rounded-lg">
        <h1 className="mb-1 text-center font-bold text-4xl">Store Login</h1>
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
        <form onSubmit={handleSubmit} className="my-12">
          <div className="mb-4">
            <label
              htmlFor="identifier"
              className="block text-gray-700 font-bold mb-2"
            >
              Email or Phone
            </label>
            <Input
              type="text"
              id="identifier"
              name="identifier"
              placeholder="Enter your email or phone"
              value={credentials.identifier}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
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
            <a href="#" className="text-gray-700 hover:underline">
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
      <footer className="mt-8 text-center text-gray-500">
        &copy; 2024 All Rights Reserved | Privacy Policy | Terms of Service
      </footer>
    </div>
  );
};

export default LoginPage;
