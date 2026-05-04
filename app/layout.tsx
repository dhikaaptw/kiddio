import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kiddio - AI Companion for Parenting",
  description: "Smart, caring support for every stage of your parenting journey.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Fredoka:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}