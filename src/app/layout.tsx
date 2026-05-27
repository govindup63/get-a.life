import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "get-some.life",
  description: "a small website that reads your subdomain and roasts you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
