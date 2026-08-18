import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Certifications",
  description: "Verified certifications, licenses, and technical credentials by John Lloyd De Guzman.",
  alternates: {
    canonical: absoluteUrl("/certifications"),
  },
  openGraph: {
    title: "Certifications | Loyd",
    description: "Verified certifications, licenses, and technical credentials by John Lloyd De Guzman.",
    url: absoluteUrl("/certifications"),
  },
};

export default function CertificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
