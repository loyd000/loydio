"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Mark = { label: string; at: number; el: HTMLElement };

// Desktop-only section ruler: hairline ticks down the right edge, a longer tick per
// [data-section] element, and a marker that slides with scroll progress. Hover shows
// the section names; click one to jump there.
// Mouse-only extra (aria-hidden, untabbable): the dock is the accessible navigation.
export default function ScrollMeter() {
  const root = useRef<HTMLDivElement>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [active, setActive] = useState(-1);
  const pathname = usePathname();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    let list: Mark[] = [];
    const max = () => Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

    const update = () => {
      frame = 0;
      const p = clamp(scrollY / max());
      el.style.setProperty("--p", String(p));
      setActive(list.reduce((a, m, i) => (m.at <= p + 0.01 ? i : a), -1));
    };
    // Where the marker sits when a section's top reaches the page top (48px = scroll-padding-top)
    const measure = () => {
      const m = max();
      list = [...document.querySelectorAll<HTMLElement>("[data-section]")].map((s) => ({
        label: s.dataset.section!,
        el: s,
        at: clamp((s.getBoundingClientRect().top + scrollY - 48) / m),
      }));
      setMarks(list);
      update();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    const ro = new ResizeObserver(measure); // page height changes as images and the calendar load
    ro.observe(document.body);
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <div ref={root} className="ruler" aria-hidden="true">
      {marks.map((m, i) => (
        <button
          key={m.label}
          type="button"
          tabIndex={-1}
          className={i === active ? "ruler-mark is-active" : "ruler-mark"}
          style={{ "--at": m.at } as React.CSSProperties}
          onClick={() => m.el.scrollIntoView()}
        >
          <span className="ruler-label">{m.label}</span>
        </button>
      ))}
      <span className="ruler-marker" />
    </div>
  );
}
