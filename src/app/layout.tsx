import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniHub - Engineering Batch Hub",
  description: "Central communication and resource hub for first-year engineering batch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <Navigation />
        {/* Main content wrapper with bottom padding for mobile nav */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 pb-24 md:pb-8 pt-6 md:pt-8 overflow-hidden">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </body>
    </html>
  );
}
