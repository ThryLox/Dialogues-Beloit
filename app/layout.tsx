import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dialogues @ Beloit",
  description: "A platform for civil discourse at Beloit College",
};

import ParticlesBackground from '@/components/ParticlesBackground'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-text min-h-screen pb-16`}>
        <ParticlesBackground />
        <main className="relative z-10">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
