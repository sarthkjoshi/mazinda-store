import Link from "next/link";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import Logout from "@/public/svg/Logout";
import { FaBitbucket } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { IoIosListBox } from "react-icons/io";
import { SiLinuxcontainers } from "react-icons/si";
import { AiFillHome } from "react-icons/ai";

export default function SideBar() {
  return (
    <aside className="flex h-screen w-64 flex-col overflow-y-auto bg-white px-5 py-8">
      <div className="space-y-3 ">
        <Link
          className="flex gap-1 transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
          href="/"
        >
          <AiFillHome />
          <span className="mx-2  text-md font-medium">Dashboard</span>
        </Link>
        <Link
          className="flex gap-1 transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 group"
          href="/products"
        >
          <SiLinuxcontainers />
          <span className="mx-2  text-md font-medium">Products</span>
        </Link>
        <Link
          className="flex gap-1 transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 group"
          href="/stock"
        >
          <IoIosListBox />
          <span className="mx-2  text-md font-medium ">Stock</span>
        </Link>
        <Link
          className="flex gap-1 transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 group"
          href="#"
        >
          <FaMoneyBillWaveAlt />
          <span className="mx-2  text-md font-medium ">Money</span>
        </Link>
        <Link
          className="flex gap-1 transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 group"
          href="#"
        >
          <RiAccountCircleFill />
          <span className="mx-2  text-md font-medium ">Account</span>
        </Link>
        <Link
          className="flex gap-1 transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 group"
          href="/bucket"
        >
          <FaBitbucket size={16} />
          <span className="mx-2  text-md font-medium ">Bucket</span>
        </Link>
        <hr />
        <Link
          className="flex gap-1 transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 group"
          href="#"
        >
          <Logout />
          <span
            onClick={() => signOut()}
            className="mx-2  text-md font-medium "
          >
            Logout
          </span>
        </Link>
      </div>
    </aside>
  );
}
