import { Quicksand } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import RootLayoutClient from "@/components/RootLayoutClient";

const quicksand = Quicksand({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Store - Mazinda",
  description: "Mazinda store end",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
