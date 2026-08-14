"use client";

import { useState, useEffect } from "react";
import { supabase, type GalleryPhoto } from "@/lib/supabase";
import Stack from "./Stack";

const MONO = "var(--font-mono), monospace";

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("gallery_photos")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setPhotos(data);
        setLoading(false);
      });
  }, []);

  if (loading || photos.length === 0) return null;

  const cards = photos.map((photo) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={photo.id}
      src={photo.image_url}
      alt="Gallery photo"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        pointerEvents: "none",
        display: "block",
      }}
    />
  ));

  return (
    <section id="photos" className="lean-section">
      <div className="section-container" style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Section header — CSS fade-in on mount (no inView needed, section only renders post-fetch) */}
        <div style={{ marginBottom: "2.5rem", animation: "pgFadeUp 0.5s ease forwards" }}>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "1rem",
            }}
          >
            — Gallery
          </p>
          <h2
            className="section-heading"
            style={{ fontSize: "clamp(24px, 3vw, 32px)", marginBottom: "1rem" }}
          >
            Photo Gallery
          </h2>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: "0.05em",
            }}
          >
            Drag or swipe to cycle through
          </p>
        </div>

        {/* Stack */}
        <div style={{ display: "flex", justifyContent: "center", animation: "pgFadeUp 0.6s 0.1s ease both" }}>
          <div
            style={{
              position: "relative",
              width: "min(400px, 90vw)",
              height: "min(400px, 90vw)",
            }}
          >
            <Stack
              cards={cards}
              randomRotation
              sensitivity={150}
              sendToBackOnClick
              autoplay
              autoplayDelay={4000}
              pauseOnHover
              mobileClickOnly
            />
          </div>
        </div>

        {/* Count pill */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem", animation: "pgFadeUp 0.4s 0.3s ease both" }}>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              border: "1px solid var(--border)",
              padding: "4px 12px",
              borderRadius: 4,
            }}
          >
            {photos.length} photo{photos.length !== 1 ? "s" : ""}
          </span>
        </div>

      </div>

      <style>{`
        @keyframes pgFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
