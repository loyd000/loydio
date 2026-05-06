import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { absoluteUrl, SITE_URL } from "@/lib/site";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
