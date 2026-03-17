import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
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
    default: "Youngmin Cho — Data Scientist",
    template: "%s | Youngmin Cho",
  },
  description:
    "Data scientist building intelligent systems at the intersection of AI and finance.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Youngmin Cho",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
