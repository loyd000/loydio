"use client";

import Image from "next/image";
import type { GalleryPhoto } from "@/lib/supabase";
import Stack from "./Stack";

const DISPLAY_FONT = "var(--font-display), 'Syne', sans-serif";

// Photos are fetched on the server in page.tsx, so the section renders in the
// initial HTML instead of popping in (and shifting the page) after a client fetch.
export default function PhotoGallery({ photos, fetchError }: { photos: GalleryPhoto[]; fetchError: boolean }) {
  if (photos.length === 0 && !fetchError) return null;

  // next/image serves a ~320px (2x on retina) resize instead of the 1-1.6MB originals.
  // Alt text comes from the admin panel; numbered fallback until one is written.
  const cards = photos.map((photo, i) => (
    <Image
      key={photo.id}
      src={photo.image_url}
      alt={photo.alt_text?.trim() || `Photo ${i + 1} of ${photos.length}`}
      width={640}
      height={640}
      sizes="(max-width: 400px) 80vw, 320px"
      draggable={false}
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
      <div className="section-container">

        {/* Section header — CSS fade-in on mount */}
        <div style={{ marginBottom: "2.5rem", animation: "pgFadeUp 0.5s ease forwards" }}>
          <p
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "lowercase",
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
            id="photo-gallery-hint"
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: "0.05em",
            }}
          >
            Drag, swipe, or use the arrow keys to cycle through
          </p>
        </div>

        {fetchError ? (
          <p
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              padding: "2rem 0",
            }}
          >
            Unable to load gallery photos.
          </p>
        ) : (
          <>
            {/* Stack */}
            <div style={{ display: "flex", justifyContent: "center", animation: "pgFadeUp 0.6s 0.1s ease both" }}>
              <div
                style={{
                  position: "relative",
                  width: "min(320px, 80vw)",
                  height: "min(320px, 80vw)",
                }}
              >
                <Stack
                  cards={cards}
                  ariaLabel="Photo gallery"
                  ariaDescribedBy="photo-gallery-hint"
                  randomRotation
                  sensitivity={150}
                  sendToBackOnClick
                  autoplay
                  autoplayDelay={4000}
                  pauseOnHover
                />
              </div>
            </div>

            {/* Count pill */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem", animation: "pgFadeUp 0.4s 0.3s ease both" }}>
              <span
                style={{
                  fontFamily: DISPLAY_FONT,
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
          </>
        )}

      </div>

    </section>
  );
}
