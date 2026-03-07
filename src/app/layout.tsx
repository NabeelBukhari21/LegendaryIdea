import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DemoScenarioHelper from "@/components/layout/DemoScenarioHelper";
import { BackboardProvider } from "@/components/backboard/BackboardProvider";
import { SolanaProvider } from "@/components/solana/SolanaProvider";
import { SessionEngineProvider } from "@/components/session/SessionEngineProvider";

export const metadata: Metadata = {
  title: "InsightBoard AI — Privacy-First Classroom Learning Copilot",
  description:
    "A privacy-first AI copilot that detects engagement dips, generates personalized recaps, and gives teachers aggregated class insights — with trust and transparency built in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-grid min-h-screen flex flex-col">
        <SessionEngineProvider>
          <SolanaProvider>
            <BackboardProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <DemoScenarioHelper />
            </BackboardProvider>
          </SolanaProvider>
        </SessionEngineProvider>
      </body>
    </html>
  );
}

