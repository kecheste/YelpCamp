import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";

const inter = Inconsolata({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YelpCamp",
  description: "Jump right in and explore our campgrounds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
