import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroAbout from "@/components/HeroAbout";
import ScrollToTop from "@/components/ScrollToTop";
import { supabase, type GalleryPhoto, type Project } from "@/lib/supabase";

// Below-fold sections — split into their own chunks (still server-rendered)
const Projects         = dynamic(() => import("@/components/Projects"));
const SkillsExperience = dynamic(() => import("@/components/SkillsExperience"));
const Certifications   = dynamic(() => import("@/components/Certifications"));
const PhotoGallery     = dynamic(() => import("@/components/PhotoGallery"));
const Contact          = dynamic(() => import("@/components/Contact"));
const Footer           = dynamic(() => import("@/components/Footer"));

// Same cadence as /projects: content edits in the admin show up within a minute
export const revalidate = 60;

export default async function Home() {
  // Fetch on the server so project and gallery content ships in the initial HTML
  const [projectsRes, photosRes] = await Promise.all([
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
    supabase.from("gallery_photos").select("*").order("sort_order", { ascending: true }),
  ]);

  if (projectsRes.error) console.error("Failed to fetch projects:", projectsRes.error);
  if (photosRes.error) console.error("Failed to fetch gallery photos:", photosRes.error);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <HeroAbout />
        <Projects
          projects={(projectsRes.data ?? []) as Project[]}
          loadError={Boolean(projectsRes.error)}
        />
        <SkillsExperience />
        <Certifications />
        <PhotoGallery
          photos={(photosRes.data ?? []) as GalleryPhoto[]}
          fetchError={Boolean(photosRes.error)}
        />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
