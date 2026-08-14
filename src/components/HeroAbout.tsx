"use client";
import Image from "next/image";
import TiltedCard from "./TiltedCard";
import { motion } from "framer-motion";

export default function HeroAbout() {
  return (
    <section
      id="about"
      className="hero-about-section"
      style={{ background: "var(--bg)", position: "relative", overflow: "hidden" }}
    >
      <div
        className="section-container hero-about-container"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="hero-about-content">
          
          {/* Header Row: Avatar + Name/Socials */}
          <motion.div
            className="hero-header-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-avatar">
              <TiltedCard
                imageSrc="/me.jpg"
                altText="Loyd De Guzman"
                captionText="Loyd"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1.05}
                showTooltip={true}
                displayOverlayContent={false}
              />
            </div>
            
            <div className="hero-name-socials">
              <div className="hero-name-wrapper">
                <h1 className="hero-name">Loyd De Guzman</h1>
              </div>
              
              <div className="hero-socials">
                <a href="https://github.com/loyd000" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a href="https://www.facebook.com/loydixyz" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="https://www.instagram.com/loyd.dg/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://open.spotify.com/user/31ydnj4nyrc2wtyxem7czazbkx5y" target="_blank" rel="noopener noreferrer" aria-label="Spotify">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 11.9c3.2-1.3 7-1 9 1"></path>
                    <path d="M7 14.5c3-1 6.5-.5 8.5 1"></path>
                    <path d="M7.5 9c3.5-1.5 8-1.5 10 0"></path>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Role Title */}
          <motion.h2
            className="hero-role"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            Computer Engineer <span className="hero-role-divider">—</span> Full-Stack, Mobile & Embedded
          </motion.h2>

          {/* Bio Description */}
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            I am a computer engineer fresh graduate who builds modern web platforms, mobile apps, and embedded/hardware-integrated systems. I bridge the gap between functionality and design, drawing on experience across TinyML, full-stack development, and graphic design to turn ideas into polished, working products.
          </motion.p>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="/RESUME_DE_GUZMAN.pdf" target="_blank" rel="noopener noreferrer" className="liquid-glass-btn" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "12px 32px", fontSize: "13px", fontWeight: 600, borderRadius: 999 }}>
              View Resume <span style={{ fontFamily: "var(--font-mono)" }}>&gt;</span>
            </a>
          </motion.div>

        </div>
      </div>

      <style>{`
        .hero-about-section { display: block; }
        .hero-about-container {
          padding-top: 8rem;
          padding-bottom: 5rem;
          display: flex;
          justify-content: center;
        }
        
        .hero-about-content {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .hero-header-row {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }
        
        .hero-avatar {
          width: 240px;
          height: 240px;
          flex-shrink: 0;
        }
        
        .hero-name-socials {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .hero-name-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .hero-name {
          font-family: var(--font-sans);
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 700;
          line-height: 1;
          margin: 0;
          color: var(--fg);
        }

        
        .hero-socials {
          display: flex;
          gap: 1rem;
        }

        .hero-socials a {
          color: var(--muted);
          transition: color 0.2s ease, transform 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-socials a:hover {
          color: var(--fg);
          transform: translateY(-2px);
        }

        /* Role */
        .hero-role {
          font-family: var(--font-sans);
          font-size: clamp(18px, 3vw, 24px);
          font-weight: 500;
          color: var(--fg);
          margin-bottom: 1.25rem;
          line-height: 1.3;
        }
        .hero-role-divider {
          color: var(--muted);
          font-weight: 300;
        }

        /* Description */
        .hero-description {
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.8;
          color: var(--muted);
          margin-bottom: 2.5rem;
        }


        @media (max-width: 600px) {
          .hero-header-row {
            gap: 1rem;
            flex-wrap: nowrap;
          }
          .hero-avatar {
            width: 100px;
            height: 100px;
          }
          .hero-about-container {
            padding-top: 6rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </section>
  );
}
