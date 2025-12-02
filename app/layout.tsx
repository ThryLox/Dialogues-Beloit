import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from '@/components/RightSidebar'
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "Dialogues @ Beloit",
  description: "A space for thoughtful conversation.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable}`}>
      <body className={montserrat.className}>
        <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
          {/* Left Sidebar (Desktop) */}
          <LeftSidebar userId={user?.id} />

          {/* Main Content Feed */}
          <main className="flex-1 w-full max-w-3xl border-r border-[var(--border-subtle)] min-h-screen">
            {children}
          </main>

          {/* Right Sidebar */}
          <RightSidebar />
        </div>

        {/* Mobile Bottom Nav */}
        <BottomNav />
      </body>
    </html>
  );
}
