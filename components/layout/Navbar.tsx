"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import logo from "@/public/images/logo.png";
import { MenuIcon, XIcon } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full bg-green-50 shadow-md px-8 py-4 flex justify-between items-center relative">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src={logo}
          alt="PurePlate Logo"
          width={140}
          height={50}
          className="object-contain"
        />
      </Link>

      {/* Desktop Navigation Menu */}
      <div className="hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6 bg-transparent">
            <NavigationMenuItem>
              <Link
                href="/"
                className={`${navigationMenuTriggerStyle()} bg-transparent text-green-700 hover:bg-green-100 rounded-xl`}
              >
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/planner"
                className={`${navigationMenuTriggerStyle()} bg-transparent text-green-700 hover:bg-green-100 rounded-xl`}
              >
                Planner
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/about"
                className={`${navigationMenuTriggerStyle()} bg-transparent text-green-700 hover:bg-green-100 rounded-xl`}
              >
                About
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/insights"
                className={`${navigationMenuTriggerStyle()} bg-transparent text-green-700 hover:bg-green-100 rounded-xl`}
              >
                Insights
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-green-700 focus:outline-none">
          {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-green-50 shadow-md flex flex-col items-start px-4 py-4 md:hidden z-50">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="w-full text-green-700 px-4 py-2 rounded-xl hover:bg-green-100"
          >
            Home
          </Link>
          <Link
            href="/planner"
            onClick={() => setIsOpen(false)}
            className="w-full text-green-700 px-4 py-2 rounded-xl hover:bg-green-100"
          >
            Planner
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="w-full text-green-700 px-4 py-2 rounded-xl hover:bg-green-100"
          >
            About
          </Link>
          <Link
            href="/insights"
            onClick={() => setIsOpen(false)}
            className="w-full text-green-700 px-4 py-2 rounded-xl hover:bg-green-100"
          >
            Insights
          </Link>
        </div>
      )}
    </nav>
  );
}
