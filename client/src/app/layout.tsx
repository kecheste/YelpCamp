import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";
import Head from "next/head";

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
      <Head>
        <link rel="icon" href="favicon.ico" sizes="any" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
