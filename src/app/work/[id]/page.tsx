import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = projects.find((x) => x.id === id);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const i = projects.findIndex((p) => p.id === id);
  if (i === -1) notFound();
  const p = projects[i];
  const next = projects.length > 1 ? projects[(i + 1) % projects.length] : null;

  return (
    <>
      <header className="project-bar">
        <Link href="/#work" className="project-bar-link">
          <ArrowLeft size={16} aria-hidden="true" /> Back
        </Link>
        {p.link && (
          <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-bar-link">
            Visit site <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        )}
      </header>

      <main className="project" data-section="Overview">
        <p className="project-meta">{p.role} / {p.period}</p>
        <h1 className="heading">{p.title}</h1>
        <p className="project-summary">{p.summary}</p>
        {p.stack.length > 0 && <p className="project-meta">{p.stack.join(" · ")}</p>}
        {p.link && (
          <a href={p.link} target="_blank" rel="noopener noreferrer" className="pill-btn">
            Visit site <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        )}

        {p.image_url && (
          <div className="work-media project-shot">
            <Image src={p.image_url} alt={`${p.title} home page`} fill priority sizes="(max-width: 640px) 92vw, 782px" style={{ objectFit: "cover", objectPosition: "top" }} />
          </div>
        )}

        {p.highlights.length > 0 && (
          <section aria-labelledby="did-heading" data-section="What I did">
            <h2 id="did-heading" className="heading">What I did</h2>
            <ul className="project-list">
              {p.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </section>
        )}
      </main>

      {next && (
        <nav className="project-next" aria-label="Next project" data-section="Next">
          <Link href={`/work/${next.id}`} className="project-next-link">
            <span className="project-meta">Next project</span>
            <span className="project-next-row">
              <span>{next.title}</span>
              <span className="project-meta">{next.role}</span>
            </span>
          </Link>
        </nav>
      )}
    </>
  );
}
