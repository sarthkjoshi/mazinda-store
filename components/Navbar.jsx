'use client'

import Link from "next/link";
import MazindaLogo from "@/public/logo_mazinda.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
      {!pathname.includes("auth") && (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 py-2">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link href={pathname.includes("admin") ? "/admin" : "store"} className="flex items-center">
              <Image
                width={120}
                height={60}
                src={MazindaLogo}
                className="h-8 mr-3"
                alt="Mazinda Logo"
              />
            </Link>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
