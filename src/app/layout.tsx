import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Noctis | AI Dream Visualizer",
  description: "Transform human dreams into surreal visual worlds, symbolic interpretations, and emotionally intelligent cinematic experiences.",
  keywords: ["AI dream visualizer", "dream interpretation", "subconscious", "generative AI art", "dream meaning"],
  openGraph: {
    title: "Noctis | AI Dream Visualizer",
    description: "Transform your cryptic nighttime visions into stunning, cinematic visual storytelling using Artificial Intelligence.",
    url: "https://noctis.onrender.com",
    siteName: "Noctis",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noctis | AI Dream Visualizer",
    description: "Visualize the unseen. Transform human dreams into surreal visual worlds.",
  },
  metadataBase: new URL("https://noctis.onrender.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased selection:bg-violet-glow/30 selection:text-white">
      <body className={`${inter.variable} font-sans min-h-full flex flex-col bg-matte-black text-foreground`}>
        {children}
      </body>
    </html>
  );
}
