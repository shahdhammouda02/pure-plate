"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { MenuIcon, XIcon, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import logo from "@/public/images/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { data: session } = useSession();
  const pathname = usePathname();

  const router = useRouter();
  const handleClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault(); // stop default link behavior
      router.push("/auth/signin");
    }
  };

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  return (
    <nav className="w-full bg-green-50 shadow-md px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center shrink-0">
        <Image
          src={logo}
          alt="PurePlate Logo"
          width={120}
          height={45}
          className="object-contain w-28 sm:w-32 lg:w-36"
        />
      </Link>

      {/* Center Menu */}
      <div className="hidden md:flex flex-1 justify-center">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4 lg:space-x-6 bg-transparent">
            <NavigationMenuItem>
              <Link
                href="/"
                className={`${navigationMenuTriggerStyle()} ${
                  isActiveLink("/") 
                    ? "bg-green-100 text-green-800" 
                    : "bg-transparent text-green-700 hover:bg-green-100"
                } rounded-xl text-sm lg:text-base transition-colors`}
              >
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/planner"
                onClick={handleClick}
                className={`${navigationMenuTriggerStyle()} ${
                  isActiveLink("/planner") 
                    ? "bg-green-100 text-green-800" 
                    : "bg-transparent text-green-700 hover:bg-green-100"
                } rounded-xl text-sm lg:text-base transition-colors`}
              >
                Planner
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/insights"
                className={`${navigationMenuTriggerStyle()} ${
                  isActiveLink("/insights") 
                    ? "bg-green-100 text-green-800" 
                    : "bg-transparent text-green-700 hover:bg-green-100"
                } rounded-xl text-sm lg:text-base transition-colors`}
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
              <User className="w-4 h-4 lg:w-5 lg:h-5 text-green-700" />
              <span className="text-green-800 font-medium text-sm lg:text-base">
                Welcome, {session?.user?.name?.split(" ")[0] || "User"}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white border-none px-3 py-1 lg:px-4 lg:py-2 rounded-lg cursor-pointer text-sm lg:text-base"
            >
              <LogOut className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              <span className="text-white">Sign Out</span>
            </Button>
          </div>
        ) : (
          <Link href="/auth/signin">
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white border-none px-3 py-1 lg:px-4 lg:py-2 rounded-lg cursor-pointer text-sm lg:text-base"
            >
              <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
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
        <div className="absolute top-full left-0 w-full bg-green-50 shadow-md flex flex-col items-start px-4 py-4 md:hidden z-50 space-y-3">
          {/* User Info in Mobile Menu */}
          {session?.user && (
            <div className="w-full px-4 py-3 border-b border-green-200">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-green-700" />
                <span className="text-green-800 font-medium">
                  Welcome, {session?.user?.name?.split(" ")[0] || "User"}
                </span>
              </div>
            </div>
          )}
          
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)} 
            className={`w-full px-4 py-3 rounded-xl text-base ${
              isActiveLink("/") 
                ? "bg-green-200 text-green-800" 
                : "text-green-700 hover:bg-green-100"
            }`}
          >
            Home
          </Link>
          <Link 
            href="/planner" 
            onClick={(e) => {
              handleClick(e);
              setIsOpen(false);
            }}
            className={`w-full px-4 py-3 rounded-xl text-base ${
              isActiveLink("/planner") 
                ? "bg-green-200 text-green-800" 
                : "text-green-700 hover:bg-green-100"
            }`}
          >
            Planner
          </Link>
          <Link 
            href="/insights" 
            onClick={() => setIsOpen(false)} 
            className={`w-full px-4 py-3 rounded-xl text-base ${
              isActiveLink("/insights") 
                ? "bg-green-200 text-green-800" 
                : "text-green-700 hover:bg-green-100"
            }`}
          >
            Insights
          </Link>
          
          {/* Mobile Auth Buttons */}
          <div className="w-full px-4 py-2 border-t border-green-200 pt-3">
            {session?.user ? (
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg cursor-pointer text-base"
              >
                <LogOut className="w-5 h-5 text-white" />
                <span className="text-white">Sign Out</span>
              </button>
            ) : (
              <Link 
                href="/auth/signin" 
                onClick={() => setIsOpen(false)} 
                className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg cursor-pointer text-base"
              >
                <User className="w-5 h-5 text-white" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}