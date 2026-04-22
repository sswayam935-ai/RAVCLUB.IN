import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Navbar from "@/components/layout/Navbar";
import GlobalBackground from "@/components/ui/GlobalBackground";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Robotics & AV Club",
  description:
    "Engineering Tomorrow, Today. The official website of the Robotics and AV Club — where circuits meet creativity.",
  keywords: ["robotics", "AV club", "engineering", "automation", "innovation"],
  openGraph: {
    title: "Robotics & AV Club",
    description: "Engineering Tomorrow, Today.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} bg-background text-text-primary antialiased`}
      >
        {/* Fixed ambient layers — behind everything, on every page */}
        <GlobalBackground />
        <ScrollProgressBar />

        <SmoothScrollProvider>
          <Navbar />
          <main>{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
