"use client";

import { Provider } from "react-redux";
import store from "@/store";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "./Navbar";

export default function RootLayoutClient({ children }) {
  return (
    <>
      <Provider store={store}>
        <Navbar />
        {children}
      </Provider>
      <Toaster />
    </>
  );
}
