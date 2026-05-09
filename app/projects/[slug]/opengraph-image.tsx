import { ImageResponse } from "next/og";
import { bySlug, allSlugs } from "@/lib/content";

export const alt = "Сергей Рамас · AI Hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata() {
  return allSlugs("project").map((slug) => ({ id: slug, alt }));
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = bySlug("project", slug);
  if (!item) {
    return new ImageResponse(<div>not found</div>, size);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#16130F",
          color: "#F2EDE3",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "monospace", fontSize: 22, color: "#DC7A4F", letterSpacing: 4 }}>
          <span>PROJECT</span>
          <span style={{ color: "#948A7E" }}>·</span>
          <span style={{ color: "#948A7E" }}>SERGEYRAMAS.VERCEL.APP</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 88,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: "#F2EDE3",
            maxWidth: 1040,
          }}
        >
          {item.title}
        </div>
        <div style={{ width: 200, height: 1, background: "#DC7A4F", marginTop: 30 }} />
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 26,
            color: "#948A7E",
            lineHeight: 1.4,
            maxWidth: 980,
          }}
        >
          {item.summary}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 18, color: "#6E665C" }}>
          <span>tg @Sergeyramas</span>
          <span>{item.tags.slice(0, 3).map((t) => `#${t}`).join("  ")}</span>
        </div>
      </div>
    ),
    size,
  );
}
