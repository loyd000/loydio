import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollToTop from "@/components/ScrollToTop";
import SiteIntro from "@/components/SiteIntro";

// Below-fold sections — lazy-loaded for faster initial paint
const About       = dynamic(() => import("@/components/About"));
const Projects    = dynamic(() => import("@/components/Projects"));
const Credentials = dynamic(() => import("@/components/Credentials"));
const Contact     = dynamic(() => import("@/components/Contact"));
const Footer      = dynamic(() => import("@/components/Footer"));

// Hidden overlay features — kept for power users
const Terminal       = dynamic(() => import("@/components/Terminal"));
const CommandPalette = dynamic(() => import("@/components/CommandPalette"));
const SpotifyWidget  = dynamic(() => import("@/components/SpotifyWidget"));

export default function Home() {
  return (
    <SiteIntro>
      <ScrollToTop />
      <Navbar />
      <Terminal />
      <CommandPalette />
      <SpotifyWidget />
      <main>
        <Hero />
        <About />
        <Projects />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </SiteIntro>
  );
}
