import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Youngmin Cho — Data Science Lead",
    template: "%s | Youngmin Cho",
  },
  description:
    "Data science lead building AI-powered tools. Portfolio, projects, and writing by Youngmin Cho.",
  keywords: ["Youngmin Cho", "data science lead", "portfolio", "AI", "machine learning", "NLP"],
  authors: [{ name: "Youngmin Cho", url: "https://www.chopaul.com" }],
  creator: "Youngmin Cho",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Youngmin Cho",
    images: [{ url: "/og?title=Youngmin%20Cho%20%E2%80%94%20Data%20Scientist", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Youngmin Cho — Data Science Lead",
    description: "Data science lead building AI-powered tools. Portfolio, projects, and writing.",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
