import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loyd — Developer & Designer",
  description: "John Lloyd De Guzman — Full-stack developer and UI designer building clean, efficient digital products.",
  keywords: ["developer", "designer", "portfolio", "full-stack", "UI/UX"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
