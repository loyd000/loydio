"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { supabase, type GalleryPhoto } from "@/lib/supabase";
import Stack from "./Stack";

const MONO = "var(--font-mono), monospace";

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

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
    <section id="photos" className="lean-section" ref={ref}>
      <div className="section-container" style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "2.5rem" }}
        >
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
        </motion.div>

        {/* Stack wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", justifyContent: "center" }}
        >
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
        </motion.div>

        {/* Count pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}
        >
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
        </motion.div>

      </div>
    </section>
  );
}
