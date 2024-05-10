"use client";

import { Provider } from "react-redux";
import store from "@/store";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import BottomNavigationBar from "@/components/BottomNavigationBar";
// import NextTopLoader from "nextjs-toploader";

export default function RootLayout({ children }) {
  return (
    <>
      <Provider store={store}>
        {/* <NextTopLoader /> */}
        <Navbar />
        <div className="flex">
          <div className="hidden md:block h-full">
            <SideBar />
          </div>
          <div className="w-full bg-gray-100 min-h-screen p-2 md:p-3 rounded-lg">
            {children}
            <div className="px-2 md:hidden">
              <BottomNavigationBar />
            </div>
          </div>
        </div>
      </Provider>
      <Toaster />
    </>
  );
}
