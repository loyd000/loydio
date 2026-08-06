import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "A complete collection of dev and design projects by John Lloyd De Guzman — full-stack builds, UI work, and graphic design.",
  alternates: {
    canonical: absoluteUrl("/projects"),
  },
  openGraph: {
    title: "Projects | Loyd",
    description: "Dev and design projects by John Lloyd De Guzman.",
    url: absoluteUrl("/projects"),
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
