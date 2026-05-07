import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import TechStack from "@/components/TechStack";
import Credentials from "@/components/Credentials";
import Projects from "@/components/Projects";
import Social from "@/components/Social";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import GridLines from "@/components/GridLines";
import ScrollToTop from "@/components/ScrollToTop";
import SiteIntro from "@/components/SiteIntro";
import Terminal from "@/components/Terminal";
import CommandPalette from "@/components/CommandPalette";
import SpotifyWidget from "@/components/SpotifyWidget";

export default function Home() {
  return (
    <SiteIntro>
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
