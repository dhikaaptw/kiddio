"use client";

import Link from "next/link";
import { useState } from "react";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      className="relative transition-colors duration-200 no-underline shrink-0"
      style={{ 
        fontFamily: "'Fredoka One', cursive", fontSize: "20px", 
        color: hovered ? "#E8956D" : "#3D2C2C" 
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <span
        className="absolute left-0 bg-[#E8956D] transition-all duration-200 block"
        style={{ bottom: "-3px", height: "2px", width: hovered ? "100%" : "0%" }}
      />
    </Link>
  );
}

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#FDF6F0] shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <div className="w-full max-w-[1440px] mx-auto px-[60px] md:px-[120px] py-[20px] flex items-center justify-between">
        
        <Link href="/" className="no-underline shrink-0">
          <span 
            className="text-[32px] text-[#E8956D] leading-none inline-block hover:opacity-80 transition-opacity" 
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            Kiddio
          </span>
        </Link>

        <div className="flex items-center gap-[32px] shrink-0">
          <NavLink href="/login">Login</NavLink>
          <Link
            href="/register"
            className="text-[20px] !text-white no-underline bg-[#E8956D] rounded-[20px] px-[32px] py-[12px] inline-block transition-all duration-200 shadow-[0_4px_0px_#c9714d] hover:-translate-y-[3px] hover:shadow-[0_6px_0px_#c9714d] active:translate-y-[2px] active:shadow-[0_2px_0px_#c9714d]"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Sign Up
          </Link>
        </div>

      </div>
    </nav>
  );
}