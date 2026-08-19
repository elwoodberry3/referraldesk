import type { Metadata } from "next";
import { buildConfig } from "@/config/build.config";
import "./globals.css";

export const metadata: Metadata = {
  title: `ReferralDesk — ${buildConfig.dealership.name}`,
  description: buildConfig.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const brand = buildConfig.dealership.brandColor;
  return (
    <html lang="en">
      <body style={{ ["--brand" as string]: brand }}>{children}</body>
    </html>
  );
}
