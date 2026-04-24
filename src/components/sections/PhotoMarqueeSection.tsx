"use client";

/*
 * PhotoMarqueeSection
 * -------------------
 * Reads from public/gallery/. To add more photos, drop files into that
 * folder and add an entry to GALLERY_PHOTOS below. The marquee duration
 * scales automatically so every photo gets screen time.
 */

/* ─── Gallery photos — matches files in public/gallery/ ─── */
const GALLERY_PHOTOS: { src: string; caption: string }[] = [
  { src: "/gallery/1.jpg", caption: "" },
  { src: "/gallery/2.jpg", caption: "" },
  { src: "/gallery/3.jpg", caption: "" },
  { src: "/gallery/4.jpg", caption: "" },
  { src: "/gallery/5.jpg", caption: "" },
  { src: "/gallery/6.jpg", caption: "" },
  { src: "/gallery/7.jpg", caption: "" },
  { src: "/gallery/8.jpg", caption: "" },
  { src: "/gallery/9.jpg", caption: "" },
  { src: "/gallery/10.jpeg", caption: "" },
  { src: "/gallery/11.jpg", caption: "" },
  { src: "/gallery/12.jpg", caption: "" },
  { src: "/gallery/IMG_20260314_154150902.jpg", caption: "" },
];

/* Duration grows with the number of photos so all are always visible */
const DURATION = `${20 + GALLERY_PHOTOS.length * 4}s`;

/* ─── Single photo card ─── */
function GalleryCard({ src, caption }: { src: string; caption: string }) {
  return (
    <div
      style={{
        position: "relative",
        flexShrink: 0,
        width: 320,
        height: 210,
        borderRadius: 16,
        margin: "0 10px",
        overflow: "hidden",
        border: "1px solid rgba(201,153,107,0.12)",
        background: "#2A2320",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={caption}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.4s ease",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")
        }
      />

      {/* Caption overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "32px 14px 12px",
          background:
            "linear-gradient(to top, rgba(28,23,20,0.88) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.58rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(201,153,107,0.85)",
            margin: 0,
          }}
        >
          {caption}
        </p>
      </div>
    </div>
  );
}

/* ─── One infinite scrolling row ─── */
function MarqueeRow({
  reverse = false,
}: {
  reverse?: boolean;
}) {
  /* Duplicate for seamless infinite loop */
  const doubled = [...GALLERY_PHOTOS, ...GALLERY_PHOTOS];

  return (
    <div style={{ overflow: "hidden", marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: reverse
            ? `marquee-reverse ${DURATION} linear infinite`
            : `marquee ${DURATION} linear infinite`,
        }}
        onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.animationPlayState =
          "paused")
        }
        onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.animationPlayState =
          "running")
        }
      >
        {doubled.map((photo, i) => (
          <GalleryCard key={`${photo.src}-${i}`} {...photo} />
        ))}
      </div>
    </div>
  );
}

/* ─── Section ─── */
export default function PhotoMarqueeSection() {
  return (
    <section
      style={{
        padding: "5rem 0",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Eyebrow */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              height: 1,
              width: 40,
              background: "rgba(201,153,107,0.45)",
              display: "block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#C9996B",
            }}
          >
            Club in Action
          </span>
          <span
            style={{
              height: 1,
              width: 40,
              background: "rgba(201,153,107,0.45)",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* Row 1 — forward */}
      <MarqueeRow />

      {/* Row 2 — reverse */}
      <MarqueeRow reverse />

      {/* Left/right edge fades */}
      <div
        aria-hidden
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, var(--background) 0%, transparent 10%, transparent 90%, var(--background) 100%)",
        }}
      />
    </section>
  );
}
