"use client";

import BottomNavigationBar from "@/components/BottomNavigationBar";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import { fetchStoreData } from "@/redux/StoreReducer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function RootLayout({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStoreData());
  }, []);
  return (
    <div className="flex w-full h-full">
      <div className="hidden md:block h-full fixed ">
        <SideBar />
      </div>
      <div className="w-full">
        <Navbar />
        {children}
        <div className="px-2 md:hidden">
          <BottomNavigationBar />
        </div>
      </div>
    </div>
  );
}
