import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import SponsorsSection from "@/components/sponsors";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "ACM@UCF",
  description: "University of Central Florida's ACM Chapter",
  icons: "/logo.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        {children}
        <SponsorsSection />
        <Footer />
      </body>
    </html>
  );
}
