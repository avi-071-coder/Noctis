"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type DreamData } from "@/types";
import { Sparkles, Brain, Clock, ChevronDown, Loader2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  dream: DreamData;
}

export default function DreamVisualization({ dream }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeSymbol, setActiveSymbol] = useState<number | null>(null);

  // For cursor interaction on symbol cards
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredSymbol, setHoveredSymbol] = useState<number | null>(null);

  const bgVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [dream.imageUrl]);

  // Programmatic autoplay stabilization
  useEffect(() => {
    if (bgVideoRef.current) {
      bgVideoRef.current.play().catch((err) => {
        console.warn("Autoplay block bypass triggered on bg video:", err);
      });
    }
  }, [dream.imageUrl, imageLoaded]);

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-20 sm:pt-28 pb-24 sm:pb-40 relative overflow-hidden bg-black select-none">
      
      {/* BACKGROUND.MP4 looping continuously behind everything */}
      <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none overflow-hidden">
        <video
          ref={bgVideoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-45 scale-102 brightness-[0.55] contrast-[1.1] filter blur-[2px]"
        >
          <source src="/BACKGROUND.mp4" type="video/mp4" />
        </video>
        {/* Fog and atmospheric overlays */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
        {/* Soft volumetric light */}
        <div className="absolute -top-1/4 left-1/4 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-violet-glow/10 rounded-full blur-[140px] mix-blend-screen" />
        <div className="absolute -bottom-1/4 right-1/4 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-moonlight-blue/10 rounded-full blur-[140px] mix-blend-screen" />
      </div>

      {/* Header Text Section */}
      <section className="relative z-10 w-full max-w-5xl px-4 sm:px-6 flex flex-col items-center text-center mb-10 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full glass border border-white/5 mb-4 sm:mb-6 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-moonlight-blue animate-pulse" />
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] uppercase text-white/90">
            Subconscious Rendered
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="text-2xl sm:text-4xl md:text-6xl font-light tracking-wide text-white mb-4 sm:mb-6 drop-shadow-xl font-sans px-4"
        >
          {dream.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-sm sm:text-md md:text-lg text-white/60 max-w-3xl font-light leading-relaxed tracking-wide italic font-serif px-4"
        >
          &ldquo;{dream.summary}&rdquo;
        </motion.p>
      </section>

      {/* 21:9 Cinematic Viewport Frame (Museum Exhibit Style) */}
      <section className="w-full max-w-6xl px-4 sm:px-6 relative z-10 mb-12 sm:mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden glass border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] group"
        >
          {/* Volumetric Fog inside frame */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-5 pointer-events-none" />

          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 p-6 text-center">
              <span className="text-white/40 text-xs tracking-widest uppercase mb-2">Image Generation Offline</span>
              <p className="text-white/20 text-xs">The subconscious stream timed out. Try re-visualizing.</p>
            </div>
          )}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-10">
              <Loader2 className="w-8 h-8 text-violet-glow animate-spin mb-4" />
              <span className="text-white/40 text-xs tracking-[0.3em] uppercase animate-pulse">
                Manifesting Visuals
              </span>
            </div>
          )}
          {!imageError && (
            <img 
              src={dream.imageUrl} 
              alt={dream.title}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] transform scale-100 group-hover:scale-102 z-1", 
                imageLoaded ? "opacity-95" : "opacity-0"
              )}
            />
          )}

          {/* Letterbox Overlays and Framing Borders */}
          <div className="absolute inset-0 border-[8px] md:border-[16px] border-black/40 pointer-events-none rounded-3xl" />
          <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-3xl" />
          <div className="absolute bottom-6 right-8 z-20 opacity-0 group-hover:opacity-40 transition-opacity duration-500">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      </section>

      {/* Narrative Section Break */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5 }}
        className="flex flex-col items-center gap-2 mb-28 text-white/30"
      >
        <span className="text-[10px] tracking-[0.35em] uppercase">Scroll to inspect components</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>

      {/* Analysis Section */}
      <section className="w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 mb-32">
        
        {/* Aurora / Energy Wave Emotional Analysis */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="glass rounded-3xl p-8 bg-black/40 border border-white/5 shadow-2xl relative overflow-hidden"
        >
          {/* Animated Background Energy Wave / Lava Lamp */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
            {dream.emotions.map((emotion, idx) => (
              <motion.div
                key={idx}
                animate={{
                  x: [Math.random() * 50, Math.random() * -50, Math.random() * 50],
                  y: [Math.random() * 60, Math.random() * -60, Math.random() * 60],
                  scale: [1.0, 1.3, 1.0],
                }}
                transition={{
                  duration: 10 + idx * 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute rounded-full"
                style={{
                  width: `${240 + emotion.intensity * 3}px`,
                  height: `${240 + emotion.intensity * 3}px`,
                  background: `radial-gradient(circle, ${emotion.color}25 0%, ${emotion.color}05 40%, transparent 70%)`,
                  left: `${10 + idx * 30}%`,
                  top: `${10 + idx * 20}%`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3.5 mb-8">
              <Brain className="w-5 h-5 text-violet-glow" />
              <h3 className="text-xl font-light tracking-wide text-white">Emotional Aurora</h3>
            </div>
            
            {/* Interactive Aurora Graph */}
            <div className="mb-10 h-32 relative flex items-end justify-between px-6 border-b border-white/5 pb-2">
              {/* Dynamic Wave Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  animate={{
                    d: [
                      "M 0 100 C 20 80, 40 60, 60 75 C 80 90, 90 70, 100 100 Z",
                      "M 0 100 C 30 70, 50 85, 70 65 C 90 45, 95 85, 100 100 Z",
                      "M 0 100 C 20 80, 40 60, 60 75 C 80 90, 90 70, 100 100 Z"
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  fill="url(#auroraGrad)"
                />
              </svg>

              {/* Floating Emotion Spheres along the graph */}
              {dream.emotions.map((emotion, idx) => (
                <div key={idx} className="flex flex-col items-center z-10 relative">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 3 + idx,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: idx * 0.5
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center relative cursor-pointer"
                    style={{ 
                      background: `radial-gradient(circle, ${emotion.color} 0%, rgba(0,0,0,0.3) 100%)`,
                      boxShadow: `0 0 20px ${emotion.color}60`,
                    }}
                  >
                    <span className="text-[10px] font-bold text-white">{emotion.intensity}</span>
                  </motion.div>
                  <span className="text-[10px] tracking-wider uppercase text-white/50 mt-3">{emotion.name}</span>
                </div>
              ))}
            </div>

            {/* Aurora detail progress bars */}
            <div className="space-y-5">
              {dream.emotions.map((emotion, idx) => (
                <div key={idx} className="relative z-10">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/70 tracking-wider capitalize font-medium">{emotion.name}</span>
                    <span className="text-white/40">{emotion.intensity}% Intensity</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${emotion.intensity}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.15 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: emotion.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Floating Dream Artifacts (Symbols) */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3.5 mb-2 pl-4">
            <Sparkles className="w-5 h-5 text-moonlight-blue" />
            <h3 className="text-xl font-light tracking-wide text-white">Subconscious Artifacts</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {dream.symbols.map((symbol, idx) => {
              const isHovered = hoveredSymbol === idx;
              const isActive = activeSymbol === idx;
              
              // Calculate card tilts based on mouse position
              const tiltX = isHovered ? -(mousePos.y / 15) : 0;
              const tiltY = isHovered ? (mousePos.x / 15) : 0;

              return (
                <motion.div
                  key={idx}
                  onMouseMove={(e) => handleMouseMove(e, idx)}
                  onMouseEnter={() => setHoveredSymbol(idx)}
                  onMouseLeave={() => {
                    setHoveredSymbol(null);
                    setMousePos({ x: 0, y: 0 });
                  }}
                  onClick={() => setActiveSymbol(isActive ? null : idx)}
                  animate={{
                    y: isHovered ? -4 : [0, -6, 0],
                    rotateX: tiltX,
                    rotateY: tiltY,
                    z: isHovered ? 20 : 0
                  }}
                  transition={{
                    y: isHovered ? { duration: 0.2 } : { duration: 4 + (idx % 2) * 2, repeat: Infinity, ease: "easeInOut" },
                    rotateX: { type: "spring", stiffness: 100, damping: 15 },
                    rotateY: { type: "spring", stiffness: 100, damping: 15 }
                  }}
                  className={cn(
                    "glass rounded-2xl p-6 bg-black/40 border border-white/5 cursor-pointer select-none transition-all duration-500 hover:border-violet-glow/30 hover:bg-black/60",
                    isActive ? "border-violet-glow/50 bg-black/80 shadow-[0_0_30px_rgba(139,92,246,0.1)]" : ""
                  )}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-4">
                      {/* Floating glowing shape indicator */}
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: idx === 0 ? "#8b5cf6" : idx === 1 ? "#60a5fa" : "#34d399",
                          boxShadow: `0 0 10px ${idx === 0 ? "#8b5cf6" : idx === 1 ? "#60a5fa" : "#34d399"}`
                        }}
                      />
                      <h4 className="text-md font-light tracking-wide text-white capitalize">{symbol.name}</h4>
                    </div>
                    <span className="text-[10px] tracking-widest uppercase text-white/30">
                      {isActive ? "Collapse" : "Decrypt"}
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden mt-4 pt-4 border-t border-white/5"
                      >
                        <p className="text-white/60 text-sm leading-relaxed font-light font-sans">
                          {symbol.meaning}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Storyboard Section (Film Strip Aesthetic) */}
      <section className="w-full max-w-5xl px-6 py-20 border-t border-white/5 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-3 font-mono">Cinematic Recall</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white">Subconscious Storyboard</h2>
        </div>

        {/* Film Strip Path with flowing light line */}
        <div className="relative">
          {/* Running connecting dashed light path for timeline */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-dashed-line pointer-events-none hidden md:block" />

          <div className="space-y-12">
            {dream.storyboard.map((scene, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, delay: idx * 0.15 }}
                className="flex flex-col md:flex-row gap-8 relative items-start group"
              >
                {/* Film roll frame circle */}
                <div className="hidden md:flex flex-none w-16 h-16 rounded-full glass border border-white/10 items-center justify-center relative z-10 bg-black/60 group-hover:border-violet-glow/40 transition-colors duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <span className="text-xs font-mono text-white/50 group-hover:text-violet-glow transition-colors font-semibold">
                    0{idx + 1}
                  </span>
                </div>

                {/* Film frame cell card */}
                <div className="glass flex-1 p-8 rounded-2xl bg-black/40 border border-white/5 transition-all duration-500 hover:bg-black/70 hover:border-white/10 relative overflow-hidden group shadow-lg">
                  {/* Subtle letterbox border stripes (Film look) */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/5 group-hover:bg-violet-glow/30 transition-colors pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 group-hover:bg-violet-glow/30 transition-colors pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <span className="text-[10px] tracking-widest uppercase text-violet-glow/85 font-mono font-semibold">
                      Scene {idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-mono">
                      <Clock className="w-3 h-3" />
                      <span>Sequence {idx * 30}s</span>
                    </div>
                  </div>

                  <h4 className="text-lg font-light tracking-wide text-white mb-2 font-sans">{scene.scene}</h4>
                  <p className="text-white/50 text-sm leading-relaxed font-light font-sans">{scene.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic line style for film connector */}
      <style jsx global>{`
        .bg-dashed-line {
          background-image: linear-gradient(to bottom, rgba(255,255,255,0.05) 50%, transparent 50%);
          background-size: 1px 12px;
          background-repeat: repeat-y;
        }
      `}</style>

    </div>
  );
}
