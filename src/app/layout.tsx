import type { Metadata } from "next";
import { Syne, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import GengarPet from "@/components/GengarPet";
import "./globals.css";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-display",
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
    <html lang="en" className={cn(geist.variable, geistMono.variable, syne.variable, "font-sans")} suppressHydrationWarning>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        {/* Global SVG filters (used for subtle refraction/displacement) */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
          <defs>
            <filter id="glass-displacement" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="turb" />
              <feColorMatrix in="turb" type="saturate" values="0" result="turbBW" />
              <feGaussianBlur in="turbBW" stdDeviation="1" result="turbBlur" />
              <feDisplacementMap in="SourceGraphic" in2="turbBlur" scale="8" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        {children}
        <GengarPet />
      </body>
    </html>
  );
}
