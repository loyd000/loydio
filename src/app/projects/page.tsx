import { supabase } from "@/lib/supabase";
import ProjectsClient from "./ProjectsClient";

export const revalidate = 60; // revalidate every 60 seconds, or you can use dynamic = 'force-dynamic'

export const metadata = {
  title: "Projects | Loyd De Guzman",
  description: "A collection of dev and design work — things I built, shipped, or explored.",
};

export default async function ProjectsPage() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch projects:", error);
  }

  return <ProjectsClient initialProjects={projects ?? []} />;
}
