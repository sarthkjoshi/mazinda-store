"use client";

import BottomNavigationBar from "@/components/BottomNavigationBar";
import Navbar from "@/components/Navbar";
import { fetchStoreData } from "@/redux/StoreReducer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function RootLayout({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStoreData());
  }, []);
  return (
    <>
      <Navbar />
      {children}
      <div className="px-2">
        <BottomNavigationBar />
      </div>
    </>
  );
}
