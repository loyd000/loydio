"use client";
import { motion } from "framer-motion";

export default function TypewriterText({ text1, text2, inView }: { text1: string; text2?: string; inView: boolean }) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const child = {
    visible: { opacity: 1, display: "inline-block" },
    hidden: { opacity: 0, display: "none" }
  };

  return (
    <motion.div variants={container} initial="hidden" animate={inView ? "visible" : "hidden"}>
      <span>
        {text1.split("").map((char, index) => (
          <motion.span variants={child} key={`t1-${index}`} style={{ whiteSpace: "pre" }}>{char}</motion.span>
        ))}
      </span>
      {text2 && (
        <>
          <br />
          <span style={{ opacity: 0.25 }}>
            {text2.split("").map((char, index) => (
              <motion.span variants={child} key={`t2-${index}`} style={{ whiteSpace: "pre" }}>{char}</motion.span>
            ))}
          </span>
        </>
      )}
    </motion.div>
  );
}
