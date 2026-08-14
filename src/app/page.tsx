import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroAbout from "@/components/HeroAbout";
import ScrollToTop from "@/components/ScrollToTop";
import Grainient from "@/components/Grainient";

// Below-fold sections — lazy-loaded for faster initial paint
const Projects         = dynamic(() => import("@/components/Projects"));
const SkillsExperience = dynamic(() => import("@/components/SkillsExperience"));
const Credentials      = dynamic(() => import("@/components/Credentials"));
const PhotoGallery     = dynamic(() => import("@/components/PhotoGallery"));
const Contact          = dynamic(() => import("@/components/Contact"));
const Footer           = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      {/* Fixed full-page Grainient background */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <Grainient
          warpStrength={0.7}
          warpFrequency={4.0}
          warpSpeed={1.2}
          rotationAmount={320}
          grainAmount={0.045}
          contrast={1.25}
          saturation={0.0}
          zoom={0.85}
        />
      </div>
      <ScrollToTop />
      <Navbar />
      <main>
        <HeroAbout />
        <Projects />
        <SkillsExperience />
        <Credentials />
        <PhotoGallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
