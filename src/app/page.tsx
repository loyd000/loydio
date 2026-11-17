import Navbar from "@/components/Navbar";
import NowPlaying from "@/components/NowPlaying";
import SelectedWork from "@/components/SelectedWork";
import GitHubContributions from "@/components/GitHubContributions";
import CopyButton from "@/components/CopyButton";
import { projects, work, recognition, research, contact, EMAIL, type Row } from "@/lib/content";

function InfoSection({ id, title, rows, children }: { id?: string; title: string; rows: Row[]; children?: React.ReactNode }) {
  return (
    <section id={id} className="info" aria-labelledby={`${title.toLowerCase()}-heading`}>
      <h2 id={`${title.toLowerCase()}-heading`} className="heading">{title}</h2>
      <dl className="info-rows">
        {children}
        {rows.map((r, i) => (
          <div className="info-row" key={i}>
            <dt className="info-label">{r.label}</dt>
            <dd className="info-text">
              {r.href ? (
                <a href={r.href} target="_blank" rel="noopener noreferrer">{r.text}</a>
              ) : (
                r.text
              )}
            </dd>
            {r.aside && <dd className="info-aside">{r.aside}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <div id="top" className="top-band" aria-hidden="true" />
      <main>
        <section id="about" className="intro column">
          <h1 className="heading">Loyd De Guzman</h1>
          <p>
            Computer engineer from the Philippines building across web, mobile and embedded
            hardware, with a designer&apos;s eye for how things should look and feel.
          </p>
          <p>
            Lately I&apos;ve been assessing claims remotely and taking freelance builds on the
            side. My thesis, <a href="#research">CATOK</a>, taught a microcontroller to tell if a
            young coconut is ripe by listening to it, and won Best Thesis. My{" "}
            <a href="/RESUME_DE_GUZMAN.pdf" target="_blank" rel="noopener noreferrer">resume</a> has
            the rest.
          </p>
          <NowPlaying />
        </section>

        <SelectedWork projects={projects} />

        <GitHubContributions />

        <div id="experience" className="column stack">
          <InfoSection title="Work" rows={work} />
          <InfoSection title="Recognition" rows={recognition} />
          <InfoSection id="research" title="Research" rows={research} />
          <InfoSection id="contact" title="Contact" rows={contact}>
            <div className="info-row">
              <dt className="info-label">Email</dt>
              <dd className="info-text">
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </dd>
              <dd className="info-aside">
                <CopyButton value={EMAIL} />
              </dd>
            </div>
          </InfoSection>

          <footer className="info-row site-footer">
            <span className="info-label">© {new Date().getFullYear()}</span>
            <span className="info-text">Loyd De Guzman</span>
            <span className="info-aside">Philippines</span>
          </footer>
        </div>
      </main>
      <Navbar />
    </>
  );
}
