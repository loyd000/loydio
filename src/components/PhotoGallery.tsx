"use client";

import { useState, useEffect } from "react";
import { supabase, type GalleryPhoto } from "@/lib/supabase";
import Stack from "./Stack";

const DISPLAY_FONT = "var(--font-display), 'Syne', sans-serif";

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    supabase
      .from("gallery_photos")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setFetchError(true);
        } else if (data) {
          setPhotos(data);
        }
        setLoading(false);
      });
  }, []);

  if (loading || (photos.length === 0 && !fetchError)) return null;

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
      <div className="section-container">

        {/* Section header — CSS fade-in on mount (no inView needed, section only renders post-fetch) */}
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
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: "0.05em",
            }}
          >
            Drag or swipe to cycle through
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
