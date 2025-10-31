"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black border-b border-neutral-800">
      {/* Brand / Logo */}
      <Link
        href="/"
        className="text-2xl font-bold tracking-tight text-white hover:text-neutral-300 transition"
      >
        Mystery Message
      </Link>

      {/* Right side actions */}
      <div className="flex items-center gap-6">
  {session ? (
    <>
      <span className="text-sm md:text-base text-neutral-300/90 font-medium tracking-tight select-none">
        {user.name || user.email}
      </span>
      <Button
        onClick={() => signOut()}
        className="
          px-5 
          py-2.5 
          rounded-lg 
          border border-neutral-800 
          bg-neutral-950/60 
          text-neutral-300 
          backdrop-blur-sm 
          hover:bg-red-500/90 
          hover:text-white 
          hover:border-red-500 
          transition-all 
          duration-200 
          ease-in-out 
          active:scale-[0.97]
        "
      >
        Sign out
      </Button>
    </>
  ) : (
    <Link href="/signin">
      <Button
        className="
          px-5 
          py-2.5 
          rounded-lg 
          bg-linear-to-r from-indigo-600 to-indigo-500 
          text-white 
          font-medium 
          tracking-tight 
          shadow-[0_0_20px_-10px_rgba(99,102,241,0.4)] 
          hover:shadow-[0_0_25px_-10px_rgba(99,102,241,0.6)] 
          hover:from-indigo-500 hover:to-indigo-600 
          transition-all 
          duration-200 
          ease-in-out 
          active:scale-[0.97]
        "
      >
        Sign in
      </Button>
    </Link>
  )}
</div>


    </nav>
  );
};

export default Navbar;



