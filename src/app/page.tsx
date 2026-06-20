"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import DreamInput from "@/components/DreamInput";
import DreamAnalysisOverlay from "@/components/DreamAnalysisOverlay";
import DreamVisualization from "@/components/DreamVisualization";
import Footer from "@/components/Footer";
import { type DreamData } from "@/types";

export default function Home() {
  const [view, setView] = useState<"preloader" | "intro" | "input" | "analyzing" | "result">("preloader");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dreamData, setDreamData] = useState<DreamData | null>(null);

  // Custom Cursor Follower Ref
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isHovering = false;

    const handleMove = (e: MouseEvent) => {
      const cursor = cursorRef.current;
      if (!cursor) return;
      
      const scale = isHovering ? 1.5 : 1;
      const borderColor = isHovering ? "rgba(96, 165, 250, 0.6)" : "rgba(139, 92, 246, 0.3)";
      
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(${scale})`;
      cursor.style.borderColor = borderColor;
    };
    
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") ||
        target.getAttribute("role") === "button"
      ) {
        isHovering = true;
      } else {
        isHovering = false;
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, []);

  const handleSubmitDream = async (dreamText: string) => {
    setIsProcessing(true);
    setView("analyzing");
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dream: dreamText }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate dream");
      }
      
      const data = await res.json();
      setDreamData(data);
      
      // Delay result transition slightly to showcase neural pathway completion
      setTimeout(() => {
        setView("result");
        setIsProcessing(false);
      }, 1000);

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to process dream. The connection to the subconscious was interrupted.");
      setView("input");
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative selection:bg-violet-glow/30 selection:text-white">
      {/* Dynamic Cursor Follower */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[99999] w-6 h-6 rounded-full border bg-white/5 -translate-x-1/2 -translate-y-1/2 mix-blend-screen hidden md:block shadow-[0_0_10px_rgba(139,92,246,0.25)] transition-[border-color,transform] duration-200 ease-out"
        style={{
          left: 0,
          top: 0,
          transform: "translate3d(-100px, -100px, 0)",
          borderColor: "rgba(139, 92, 246, 0.3)"
        }}
      />

      {/* Navigation (Cinematic Layout) */}
      {view !== "preloader" && (
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.5 }}
          className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl z-50 p-6 md:p-8 flex justify-between items-center pointer-events-auto"
        >
          <div 
            onClick={() => { if (!isProcessing) setView("intro"); }}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-violet-glow to-moonlight-blue shadow-[0_0_15px_rgba(139,92,246,0.6)] group-hover:scale-105 transition-transform" />
            <span className="font-semibold tracking-[0.25em] uppercase text-[10px] sm:text-xs text-white/95">Noctis</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {view === "intro" && (
              <button
                onClick={() => setView("input")}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/20 bg-white text-black hover:bg-transparent hover:text-white hover:border-white/40 text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Get Started
              </button>
            )}
            {view === "result" && (
              <button
                onClick={() => setView("input")}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-white/80 hover:text-white transition-all cursor-pointer shadow-lg active:scale-[0.98]"
              >
                Inscribe New Dream
              </button>
            )}
          </div>
        </motion.nav>
      )}

      {/* View Controller Stack */}
      <AnimatePresence mode="wait">
        {view === "preloader" && (
          <Preloader key="preloader" onComplete={() => setView("intro")} />
        )}
        
        {view === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
          >
            <Hero onStart={() => setView("input")} />
          </motion.div>
        )}

        {view === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
          >
            <DreamInput onSubmit={handleSubmitDream} isProcessing={isProcessing} />
          </motion.div>
        )}

        {view === "result" && dreamData && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
          >
            <DreamVisualization dream={dreamData} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Neural Overlay */}
      <DreamAnalysisOverlay isVisible={view === "analyzing"} />

      {/* Global Footer (shown in normal screens only) */}
      {view !== "preloader" && view !== "analyzing" && (
        <Footer />
      )}
    </main>
  );
}
