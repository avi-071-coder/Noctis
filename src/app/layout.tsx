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
