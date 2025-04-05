import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import AppWalletProvider from "@/components/AppWalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SuperNoob",
  description: "SuperNoob - Your Resume Feedback Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWalletProvider>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-[480px] mx-auto pb-16">
              {children}
            </div>
            <BottomNavigation />
          </div>
        </AppWalletProvider>
      </body>
    </html>
  );
}
