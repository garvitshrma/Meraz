import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = "MERAZ 7.0, Retro India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#1A1A1A", padding: 24 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 70px",
            background: "radial-gradient(circle at 80% 30%, #D7263D 0 170px, #F4A300 171px)",
            border: "8px solid #F3E6C8",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 8, color: "#1A1A1A", fontWeight: 700 }}>{site.college.toUpperCase()} PRESENTS</div>
          <div style={{ display: "flex", fontSize: 200, fontWeight: 900, lineHeight: 1, color: "#F3E6C8", textShadow: "10px 10px 0 #E0218A, -4px -4px 0 #0F7C7C" }}>MERAZ 7.0</div>
          <div style={{ display: "flex", fontSize: 44, color: "#1A1A1A", marginTop: 10 }}>{site.tagline}</div>
          <div style={{ display: "flex", marginTop: 30, gap: 20 }}>
            <div style={{ display: "flex", background: "#1A1A1A", color: "#F2C14E", fontSize: 34, padding: "10px 24px" }}>RETRO INDIA</div>
            <div style={{ display: "flex", background: "#E0218A", color: "#F3E6C8", fontSize: 34, padding: "10px 24px" }}>{site.college.toUpperCase()}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
