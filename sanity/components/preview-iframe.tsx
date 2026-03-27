import { useClient } from "sanity";
import { useEffect, useState } from "react";

export function Iframe(props: {
  document: { displayed: { slug?: { current?: string } } };
  options: { slug: string };
}) {
  const slug = props.document?.displayed?.slug?.current;
  const basePath = props.options?.slug || "/";
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  if (!slug) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#888",
          fontSize: 14,
        }}
      >
        Save the document with a slug to see a preview.
      </div>
    );
  }

  const secret = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET || "preview";
  const draftUrl = `${baseUrl}/api/draft-mode/enable?secret=${secret}&redirect=${encodeURIComponent(`${basePath}${slug}`)}`;
  const url = `${baseUrl}${basePath}${slug}`;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "8px 12px",
          background: "#f3f3f3",
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12,
          color: "#666",
        }}
      >
        <span>{url}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#111", textDecoration: "underline" }}
        >
          Open in new tab ↗
        </a>
      </div>
      <iframe
        src={draftUrl}
        style={{ flex: 1, border: "none", width: "100%" }}
        title="Preview"
      />
    </div>
  );
}
