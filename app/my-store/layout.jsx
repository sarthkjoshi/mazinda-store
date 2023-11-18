"use client";

import BottomNavigationBar from "@/components/BottomNavigationBar";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
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
