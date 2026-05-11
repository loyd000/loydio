import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollProgress from "@/components/ScrollProgress";
import GridLines from "@/components/GridLines";
import ScrollToTop from "@/components/ScrollToTop";
import SiteIntro from "@/components/SiteIntro";
import Terminal from "@/components/Terminal";
import CommandPalette from "@/components/CommandPalette";
import SpotifyWidget from "@/components/SpotifyWidget";
import CursorFollower from "@/components/CursorFollower";

// Below-fold sections — lazy-loaded for faster initial paint
const About = dynamic(() => import("@/components/About"));
const Experience = dynamic(() => import("@/components/Experience"));
const TechStack = dynamic(() => import("@/components/TechStack"));
const Credentials = dynamic(() => import("@/components/Credentials"));
const Projects = dynamic(() => import("@/components/Projects"));
const Social = dynamic(() => import("@/components/Social"));
const Contact = dynamic(() => import("@/components/Contact"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <SiteIntro>
      <CursorFollower />
      <GridLines />
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <Terminal />
      <CommandPalette />
      <SpotifyWidget />
      <main>
        <Hero />
        <About />
        <Experience />
        <TechStack />
        <Credentials />
        <Projects />
        <Social />
        <Contact />
      </main>
      <Footer />
    </SiteIntro>
  );
}
