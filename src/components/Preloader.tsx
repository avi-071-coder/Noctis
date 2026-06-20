"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [mounted, setMounted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    if (mounted && videoRef.current) {
      // Direct call to play() to bypass aggressive browser autoplay blocks
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay block bypass triggered:", err);
      });
    }
  }, [mounted]);

  const handleVideoEnded = () => {
    setVideoEnded(true);
    // 800ms delay to allow the fade-out scaling transition to look smooth
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden select-none">
      {/* Centered Full Screen Video Player */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: videoEnded ? 0 : 1, 
          scale: videoEnded ? 1.02 : 1 
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-full h-full"
      >
        <video
          ref={videoRef}
          src="/LOGO.mp4"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="w-full h-full object-contain sm:object-cover"
        />
      </motion.div>

      {/* Narrative clue */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: videoEnded ? 0 : 0.4 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 font-light tracking-[0.3em] uppercase text-[10px] sm:text-xs text-white/60 pointer-events-none font-mono text-center w-full px-4"
      >
        Initializing subconscious link
      </motion.p>
    </div>
  );
}
