export default function GridLines() {
  return (
    <>
      {/* ── Left side ─────────────────────────────────────────────
          [white 4rem] | outer-line | [diagonal 8rem] | inner-line | content */}
      <div className="grid-line grid-line-outer-left" />
      <div className="grid-strip grid-strip-left" />
      <div className="grid-line grid-line-left" />

      {/* ── Right side ── */}
      <div className="grid-line grid-line-outer-right" />
      <div className="grid-strip grid-strip-right" />
      <div className="grid-line grid-line-right" />
    </>
  );
}
