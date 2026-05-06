"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { supabase, type Credential, type CredentialPhoto } from "@/lib/supabase";
import TypewriterText from "./TypewriterText";

const MONO = "'IBM Plex Mono', monospace";

function CredentialItem({ item, index, inView, groupIndex }: { item: Credential; index: number; inView: boolean; groupIndex: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay: groupIndex * 0.1 + index * 0.08 }}
    >
      <div className="rule" />
      <div style={{ padding: "1.25rem 0" }}>
        <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: "0.4rem" }}>
          {item.link
            ? <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--fg)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>{item.title}</a>
            : item.title
          }
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.45 }}>{item.org}</span>
          <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.3, whiteSpace: "nowrap" }}>{item.year}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Credentials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [photos, setPhotos] = useState<CredentialPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    Promise.all([
      supabase.from("credentials").select("*").order("sort_order", { ascending: true }),
      supabase.from("credential_photos").select("*").order("created_at", { ascending: false })
    ]).then(([credRes, photoRes]) => {
      if (credRes.error || photoRes.error) {
        setLoadError(credRes.error?.message ?? photoRes.error?.message ?? "Credentials failed to load.");
        setLoading(false);
        return;
      }
      setCredentials(credRes.data ?? []);
      setPhotos(photoRes.data ?? []);
      setLoading(false);
    });
  }, []);

  const displayPhotos = photos.length > 0 
    ? [...photos, ...photos] 
    : [
        { id: "1", image_url: "https://images.unsplash.com/photo-1589330694653-efa647611efd?q=80&w=800&auto=format&fit=crop" } as CredentialPhoto,
        { id: "2", image_url: "https://images.unsplash.com/photo-1589330694653-efa647611efd?q=80&w=800&auto=format&fit=crop" } as CredentialPhoto
      ];

  return (
    <section id="credentials" ref={ref} style={{ position: "relative", padding: "8rem 0", background: "var(--bg)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}>
        <span className="vertical-label">Credentials</span>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, overflow: "hidden", pointerEvents: "none" }}>
        <span className="section-watermark">04</span>
      </div>

      <div className="section-container">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6 }}>
          <div className="rule" />
          <h2 style={{ fontFamily: MONO, fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 700, lineHeight: 1.1 }}>
            <TypewriterText text1="Learned, Certified," text2="Recognized." inView={inView} />
          </h2>
          <div className="rule" />
          <div style={{ height: "1.5rem" }} />
          <div className="rule" />
          <p style={{ fontSize: 13, opacity: 0.5, maxWidth: 460, lineHeight: 1.8 }}>
            Courses completed, events attended, and recognition earned throughout my journey as a developer and designer.
          </p>
          <div className="rule" />
        </motion.div>

        <div style={{ height: "4rem" }} />

        {/* Unified Layout with Vertical Slider */}
        {loading ? (
          <div style={{ fontFamily: MONO, fontSize: 11, opacity: 0.35, letterSpacing: "0.2em", padding: "2rem 0" }}>LOADING...</div>
        ) : loadError ? (
          <div style={{ fontFamily: MONO, fontSize: 11, opacity: 0.5, letterSpacing: "0.1em", padding: "2rem 0" }}>CREDENTIALS FAILED TO LOAD</div>
        ) : credentials.length === 0 ? (
          <div style={{ fontFamily: MONO, fontSize: 11, opacity: 0.35, letterSpacing: "0.2em", padding: "2rem 0" }}>— NO CREDENTIALS UPLOADED</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem" }}>
            
            {/* Left: Text List */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {credentials.map((item, ii) => (
                <CredentialItem key={item.id} item={item} index={ii} inView={inView} groupIndex={0} />
              ))}
              <div className="rule" />
            </div>

            {/* Right: Vertical Image Slider */}
            <div style={{ position: "relative", height: "100%", minHeight: "400px" }}>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ position: "absolute", inset: 0, overflow: "hidden", border: "1px solid var(--border)" }}
              >
                <motion.div 
                  initial={{ y: "0%" }}
                  animate={inView ? { y: ["0%", "-50%"] } : { y: "0%" }}
                  transition={{ ease: "linear", duration: 15, repeat: Infinity }}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {displayPhotos.map((p, i) => (
                    <Image
                      key={`${p.id}-${i}`}
                      src={p.image_url}
                      alt=""
                      width={800}
                      height={600}
                      sizes="(max-width: 900px) 100vw, 50vw"
                      style={{ width: "100%", height: "auto", objectFit: "cover", display: "block" }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
