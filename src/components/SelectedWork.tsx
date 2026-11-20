"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/lib/content";

export default function SelectedWork({ projects }: { projects: Project[] }) {
  const track = useRef<HTMLUListElement>(null);

  // Center the neighbouring card (absolute target, so repeat clicks never stall mid-snap).
  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const cards = [...el.children] as HTMLElement[];
    const center = el.scrollLeft + el.clientWidth / 2;
    const current = cards.reduce((best, c, i) =>
      Math.abs(c.offsetLeft + c.offsetWidth / 2 - center) <
      Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - center) ? i : best, 0);
    const next = cards[Math.min(Math.max(current + dir, 0), cards.length - 1)];
    el.scrollTo({ left: next.offsetLeft + next.offsetWidth / 2 - el.clientWidth / 2, behavior: "smooth" });
  };

  if (projects.length === 0) return null;

  return (
    <section id="work" className="work" aria-labelledby="work-heading">
      <h2 id="work-heading" className="heading heading-center">Selected work</h2>

      <ul ref={track} className="work-track" aria-label="Selected work" tabIndex={0}>
        {projects.map((p, i) => {
          const media = (
            <div className="work-media">
              {p.image_url && (
                <Image
                  src={p.image_url}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 88vw, 780px"
                  loading={i === 0 ? "eager" : "lazy"}
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              )}
            </div>
          );
          return (
            <li key={p.id} className="work-card">
              <Link href={`/work/${p.id}`} className="work-link">
                {media}
                <span className="work-title">{p.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {projects.length > 1 && (
        <div className="work-controls column">
          <button type="button" className="round-btn" onClick={() => step(-1)} aria-label="Previous project">
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button type="button" className="round-btn" onClick={() => step(1)} aria-label="Next project">
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
