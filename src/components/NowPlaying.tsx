"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type NowPlayingData = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string | null;
  songUrl?: string;
};

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch("/api/spotify/now-playing");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch now playing", err);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  return (
    <div className="now-playing-container">
      <AnimatePresence mode="wait">
        {data.isPlaying ? (
          <motion.a
            key="playing"
            href={data.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="now-playing-active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {data.albumArt && (
              <div className="np-album-art">
                <Image
                  src={data.albumArt}
                  alt={data.title ?? "Album art"}
                  width={32}
                  height={32}
                  style={{ borderRadius: 4 }}
                />
              </div>
            )}
            <div className="np-info">
              <div className="np-title-row">
                <span className="np-title">{data.title}</span>
                <span className="np-eq">
                  <span className="np-bar" />
                  <span className="np-bar" />
                  <span className="np-bar" />
                </span>
              </div>
              <span className="np-artist">{data.artist}</span>
            </div>
          </motion.a>
        ) : (
          <motion.div
            key="idle"
            className="now-playing-idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <span className="np-icon">♫</span>
            <span className="np-text">Not playing anything right now</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .now-playing-container {
          margin-top: 0;
          min-height: 48px;
          display: flex;
          align-items: center;
        }

        .now-playing-idle {
          display: inline-flex;
          box-sizing: border-box;
          width: 280px;
          align-items: center;
          gap: 0.5rem;
          padding: 8px 16px;
          background: var(--subtle-bg);
          border: 1px solid var(--border);
          border-radius: 999px;
          color: var(--muted);
          font-family: var(--font-sans);
          font-size: 13px;
        }

        .np-icon {
          font-size: 14px;
        }

        .now-playing-active {
          display: inline-flex;
          box-sizing: border-box;
          width: 280px;
          align-items: center;
          gap: 0.75rem;
          padding: 6px 16px 6px 6px;
          background: var(--subtle-bg);
          border: 1px solid var(--border);
          border-radius: 999px;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .now-playing-active:hover {
          background: var(--hover-bg);
          transform: translateY(-2px);
        }

        .np-album-art {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 50%;
        }

        .np-info {
          display: flex;
          min-width: 0;
          flex-direction: column;
          justify-content: center;
          padding-right: 4px;
        }

        .np-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .np-title {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          color: var(--fg);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
        }

        .np-artist {
          font-family: var(--font-sans);
          font-size: 11px;
          color: var(--muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
        }

        /* Equalizer Animation */
        .np-eq {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 10px;
          margin-bottom: 2px;
        }

        .np-bar {
          width: 2px;
          background-color: #1ed760; /* Spotify Green */
          border-radius: 1px;
          animation: eq-bounce 1s infinite alternate ease-in-out;
        }

        .np-bar:nth-child(1) { height: 4px; animation-delay: 0s; }
        .np-bar:nth-child(2) { height: 8px; animation-delay: -0.2s; }
        .np-bar:nth-child(3) { height: 5px; animation-delay: -0.4s; }

        @media (max-width: 480px) {
          .now-playing-container {
            margin-top: 0;
            min-height: 32px;
          }

          .now-playing-idle,
          .now-playing-active {
            width: 190px;
            height: 32px;
          }

          .now-playing-idle {
            gap: 0.25rem;
            padding: 4px 8px;
            font-size: 11px;
          }

          .now-playing-active {
            gap: 0.375rem;
            padding: 3px 8px 3px 3px;
          }

          .np-album-art {
            width: 24px;
            height: 24px;
          }

          .np-album-art img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .np-info {
            padding-right: 0;
          }

          .np-title-row {
            gap: 4px;
          }

          .np-title {
            font-size: 11px;
            max-width: 108px;
          }

          .np-artist {
            font-size: 9px;
            max-width: 108px;
          }

          .np-text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        @keyframes eq-bounce {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
