import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import ScrollMeter from "@/components/ScrollMeter";
import "./globals.css";
import { absoluteUrl, SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Loyd - Developer & Designer",
    template: "%s | Loyd",
  },
  description: "John Lloyd De Guzman - full-stack developer and UI designer building clean, efficient digital products.",
  keywords: ["developer", "designer", "portfolio", "full-stack", "UI/UX", "Next.js", "Supabase"],
  authors: [{ name: "John Lloyd De Guzman" }],
  creator: "John Lloyd De Guzman",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "Loyd - Developer & Designer",
    description: "Full-stack development, UI design, web platforms, mobile apps, and IoT systems.",
    url: absoluteUrl("/"),
    siteName: "Loyd",
    images: [
      {
        url: "/me.jpg",
        width: 1200,
        height: 1600,
        alt: "John Lloyd De Guzman",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loyd - Developer & Designer",
    description: "Full-stack developer and UI designer building clean, efficient digital products.",
    images: ["/me.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <MotionProvider>
          {children}
        </MotionProvider>
        <ScrollMeter />
      </body>
    </html>
  );
}
