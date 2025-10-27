"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { MenuIcon, XIcon, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import logo from "@/public/images/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { data: session } = useSession();

  const router = useRouter();
  const handleClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault(); // stop default link behavior
      router.push("/auth/signin");
    }
  };

  return (
   <nav className="w-full bg-green-50 shadow-md px-8 py-4 flex justify-between items-center relative">
  {/* Logo */}
  <Link href="/" className="flex items-center shrink-0">
    <Image
      src={logo}
      alt="PurePlate Logo"
      width={140}
      height={50}
      className="object-contain"
    />
  </Link>

  {/* Center Menu */}
  <div className="flex-1 flex justify-center">
    <NavigationMenu>
      <NavigationMenuList className="flex space-x-6 bg-transparent">
        <NavigationMenuItem>
          <Link
            href="/"
            className={`${navigationMenuTriggerStyle()} bg-transparent text-green-700 hover:bg-green-100 hover:text-green-700 rounded-xl`}
          >
            Home
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href="/planner"
            onClick={handleClick}
            className={`${navigationMenuTriggerStyle()} bg-transparent text-green-700 hover:bg-green-100 hover:text-green-700 rounded-xl`}
          >
            Planner
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href="/insights"
            className={`${navigationMenuTriggerStyle()} bg-transparent text-green-700 hover:bg-green-100 hover:text-green-700 rounded-xl`}
          >
            Insights
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>

  {/* Right Side: User / Sign In */}
  <div className="hidden md:flex items-center space-x-3 shrink-0">
    {session?.user ? (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-green-100">
          <User className="w-5 h-5 text-green-700" />
          <span className="text-green-800 font-medium">
            Welcome, {session.user.name}
          </span>
        </div>
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white border-none px-4 py-2 rounded-lg cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-white" />
          <span className="text-white">Sign Out</span>
        </Button>
      </div>
    ) : (
      <Link href="/auth/signin">
        <Button
          variant="outline"
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white border-none px-4 py-2 rounded-lg cursor-pointer"
        >
          <User className="w-5 h-5 text-white" />
          <span className="text-white">Sign In</span>
        </Button>
      </Link>
    )}
  </div>

  {/* Mobile Menu Button */}
  <div className="md:hidden flex items-center">
    <button onClick={toggleMenu} className="text-green-700 focus:outline-none">
      {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
    </button>
  </div>

  {/* Mobile Dropdown */}
  {isOpen && (
    <div className="absolute top-full left-0 w-full bg-green-50 shadow-md flex flex-col items-start px-4 py-4 md:hidden z-50 space-y-2">
      <Link href="/" onClick={() => setIsOpen(false)} className="w-full text-green-700 px-4 py-2 rounded-xl hover:bg-green-100">
        Home
      </Link>
      <Link href="/planner" onClick={() => setIsOpen(false)} className="w-full text-green-700 px-4 py-2 rounded-xl hover:bg-green-100">
        Planner
      </Link>
      <Link href="/insights" onClick={() => setIsOpen(false)} className="w-full text-green-700 px-4 py-2 rounded-xl hover:bg-green-100">
        Insights
      </Link>
      {!session?.user && (
        <Link href="/auth/signin" onClick={() => setIsOpen(false)} className="w-full text-green-700 px-4 py-2 rounded-xl hover:bg-green-100 flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Sign In</span>
        </Link>
      )}
    </div>
  )}
</nav>

  );
}       
