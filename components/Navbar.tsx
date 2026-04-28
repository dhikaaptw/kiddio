"use client";

import Link from "next/link";
import { useState } from "react";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      style={{
        fontFamily: "'Fredoka One', cursive",
        fontSize: "20px",
        color: hovered ? "#E8956D" : "#3D2C2C",
        textDecoration: "none",
        transition: "color 0.2s ease",
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <span
        style={{
          position: "absolute",
          bottom: "-3px",
          left: 0,
          width: hovered ? "100%" : "0%",
          height: "2px",
          backgroundColor: "#E8956D",
          transition: "width 0.2s ease",
          display: "block",
        }}
      />
    </Link>
  );
}

function SignUpButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <Link
      href={href}
      style={{
        fontFamily: "'Fredoka', sans-serif",
        fontSize: "20px",
        color: "#FFFFFF",
        textDecoration: "none",
        backgroundColor: "#E8956D",
        borderRadius: "20px",
        padding: "10px 28px",
        display: "inline-block",
        transition: "all 0.2s ease",
        boxShadow: pressed
          ? "0 2px 0px #c9714d"
          : hovered
          ? "0 7px 0px #c9714d"
          : "0 4px 0px #c9714d",
        transform: pressed
          ? "translateY(2px)"
          : hovered
          ? "translateY(-3px)"
          : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "#FDF6F0",
        padding: "16px 80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Link href="/" style={{ textDecoration: "none" }}>
        <span
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "40px",
            color: "#E8956D",
            lineHeight: 1,
            transition: "opacity 0.2s ease",
            display: "inline-block",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Kiddio
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <NavLink href="/login">Login</NavLink>
        <SignUpButton href="/register">Sign Up</SignUpButton>
      </div>
    </nav>
  );
}