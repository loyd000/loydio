import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroAbout from "@/components/HeroAbout";
import ScrollToTop from "@/components/ScrollToTop";

// Below-fold sections — lazy-loaded for faster initial paint
const Projects         = dynamic(() => import("@/components/Projects"));
const SkillsExperience = dynamic(() => import("@/components/SkillsExperience"));
const Certifications   = dynamic(() => import("@/components/Certifications"));
const PhotoGallery     = dynamic(() => import("@/components/PhotoGallery"));
const Contact          = dynamic(() => import("@/components/Contact"));
const Footer           = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <HeroAbout />
        <Projects />
        <SkillsExperience />
        <Certifications />
        <PhotoGallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
