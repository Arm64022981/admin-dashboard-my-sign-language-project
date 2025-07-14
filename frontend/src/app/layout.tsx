import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import Sidebar from "@/components/ui/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ระบบจัดการโรงพยาบาล",
  description: "ระบบจัดการข้อมูลหมอและพยาบาล",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="w-full h-screen m-0 p-0">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-screen m-0 p-0 bg-gradient-to-r from-blue-800 to-blue-900`}>
        <div className="flex w-screen h-screen m-0 p-0">
          <Sidebar />
          <div className="flex-1 min-w-0 w-full bg-transparent m-0 p-0 overflow-y-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}