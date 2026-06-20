"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DreamAnalysisOverlayProps {
  isVisible: boolean;
}

const STAGES = [
  "Reading Subconscious Journal",
  "Decrypting Emotional Frequencies",
  "Decoding Symbolic Artifacts",
  "Reconstructing Dream Memories",
  "Manifesting Visual Reality"
];

export default function DreamAnalysisOverlay({ isVisible }: DreamAnalysisOverlayProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cycle through analysis stages
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Direct autoplay trigger when visible
  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay block bypass triggered on scanner:", err);
      });
    }
  }, [isVisible]);

  // SVG Constellation / Neural Pathway animation logic in Canvas for performance
  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Create node coordinates
    const nodeCount = 45;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      glowColor: string;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        glowColor: i % 2 === 0 ? "139, 92, 246" : "96, 165, 250",
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Draw lines (neural connections)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.15;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes (neurons/stars)
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        // Bounce off screen boundaries
        if (n.x < 0 || n.x > window.innerWidth) n.vx *= -1;
        if (n.y < 0 || n.y > window.innerHeight) n.vy *= -1;

        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${n.glowColor}, 0.5)`;
        ctx.fillStyle = `rgba(${n.glowColor}, ${n.alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
        >
          {/* Full Screen Visual Scanner Background */}
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
            <video
              ref={videoRef}
              src="/VISUALIZATION.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-60 filter brightness-[0.7] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          </div>

          {/* Neural Pathways Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 z-1 pointer-events-none w-full h-full block" />

          {/* Shifting background colors */}
          <div className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-violet-glow/10 blur-[130px] pointer-events-none mix-blend-screen animate-pulse-slow z-2" />

          <div className="relative z-10 flex flex-col items-center max-w-xl w-full px-6 text-center">
            
            {/* Visual Centerpiece (Holographic HUD scanning rings framing a glowing neural node) */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center mb-10 sm:mb-16">
              
              {/* Spinning HUD rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-violet-glow/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 sm:-inset-4 rounded-full border border-white/10"
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-6 sm:-inset-8 rounded-full bg-violet-glow/10 blur-xl"
              />

              {/* Glowing core sphere */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-violet-glow to-moonlight-blue shadow-[0_0_30px_rgba(139,92,246,0.5)] animate-pulse" />
            </div>

            {/* Neural Decoding Stage Texts */}
            <div className="h-16 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStageIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 0.85, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="flex flex-col items-center font-sans"
                >
                  <p className="text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-violet-glow mb-1.5 sm:mb-2 font-mono font-semibold">
                    Neural decoding active
                  </p>
                  <h3 className="text-base sm:text-lg md:text-xl font-light text-white tracking-wide">
                    {STAGES[currentStageIdx]}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
