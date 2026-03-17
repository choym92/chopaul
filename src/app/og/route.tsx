import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Youngmin Cho";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: "3px",
            color: "#666",
            marginBottom: "24px",
            fontFamily: "monospace",
          }}
        >
          CHOPAUL.COM
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 300,
            color: "#e5e5e5",
            lineHeight: 1.2,
            maxWidth: "900px",
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
