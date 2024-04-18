import Link from "next/link";
import MazindaLogo from "@/public/logo/logo_mazinda_full.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <nav className="bg-white flex flex-wrap items-center justify-between mx-auto py-4 px-4 md:py-5 md:px-7">
        <Link href="/" className="flex items-center">
          <Image
            width={130}
            src={MazindaLogo}
            className="mr-3 object-contain"
            alt="Mazinda Logo"
          />
        </Link>

        {status === "authenticated" ? (
          <>
            <div className="text-center hidden md:block">
              <span>{session?.user.storeName.toUpperCase()}</span>
            </div>
            <Button
              variant="destructive"
              className="md:hidden"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </>
        ) : null}
      </nav>
    </>
  );
};

export default Navbar;
