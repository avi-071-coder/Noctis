"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import DreamInput from "@/components/DreamInput";
import DreamVisualization from "@/components/DreamVisualization";
import Footer from "@/components/Footer";
import { type DreamData } from "@/types";

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dreamData, setDreamData] = useState<DreamData | null>(null);

  const handleStart = () => {
    setHasStarted(true);
    // Smooth scroll to input section
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth"
      });
    }, 100);
  };

  const handleSubmitDream = async (dreamText: string) => {
    setIsProcessing(true);
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dream: dreamText }),
      });

      if (!res.ok) throw new Error("Failed to generate dream");
      
      const data = await res.json();
      setDreamData(data);

      // Smooth scroll down to the visualization
      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight * 2,
          behavior: "smooth"
        });
      }, 500);

    } catch (error) {
      console.error(error);
      alert("Failed to process dream. The connection to the subconscious was interrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-matte-black text-white relative selection:bg-violet-glow/30 selection:text-white">
      {/* Navigation (Minimal) */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-glow to-moonlight-blue shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
          <span className="font-medium tracking-widest uppercase text-sm">Noctis</span>
        </div>
      </nav>

      <Hero onStart={handleStart} />

      {hasStarted && (
        <div className="min-h-screen">
          <DreamInput onSubmit={handleSubmitDream} isProcessing={isProcessing} />
        </div>
      )}

      {dreamData && (
        <DreamVisualization dream={dreamData} />
      )}

      <Footer />
    </main>
  );
}
