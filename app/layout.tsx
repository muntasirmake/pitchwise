import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PitchWise Hero",
  description: "Investor-grade pitch deck hero section",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
