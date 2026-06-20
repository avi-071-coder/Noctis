"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Hero({ onStart }: { onStart: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentScene, setCurrentScene] = useState(0);

  // Monitor scroll progress in the 400vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax and scale effects for the video background
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.15, 1.0]);
  const videoBlur = useTransform(scrollYProgress, [0, 0.7, 1], ["blur(0px)", "blur(2px)", "blur(8px)"]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [0.85, 0.6, 0.2]);

  // Opacity transforms for each narrative scene
  const opacity1 = useTransform(scrollYProgress, [0, 0.12, 0.22], [0, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.12, 0.22], [50, 0, -50]);

  const opacity2 = useTransform(scrollYProgress, [0.22, 0.35, 0.45], [0, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.22, 0.35, 0.45], [50, 0, -50]);

  const opacity3 = useTransform(scrollYProgress, [0.45, 0.6, 0.7], [0, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.45, 0.6, 0.7], [50, 0, -50]);

  const opacity4 = useTransform(scrollYProgress, [0.72, 0.88, 1], [0, 1, 1]);
  const y4 = useTransform(scrollYProgress, [0.72, 0.88, 1], [60, 0, 0]);

  // Update dots indicator based on scroll progress
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (latest < 0.22) {
        setCurrentScene(0);
      } else if (latest < 0.45) {
        setCurrentScene(1);
      } else if (latest < 0.7) {
        setCurrentScene(2);
      } else {
        setCurrentScene(3);
      }
    });
  }, [scrollYProgress]);

  const scrollToScene = (index: number) => {
    if (!containerRef.current) return;
    const height = window.innerHeight;
    // Map index to scroll position (0, 1.1, 2.1, 3.2 viewports)
    let multiplier = 0.12;
    if (index === 1) multiplier = 0.35;
    if (index === 2) multiplier = 0.6;
    if (index === 3) multiplier = 0.88;
    
    window.scrollTo({
      top: containerRef.current.offsetTop + containerRef.current.offsetHeight * multiplier,
      behavior: "smooth",
    });
  };

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-black select-none">
      {/* Sticky Cinematic Shell */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        
        {/* Cinematic Video Background */}
        <motion.div 
          style={{ 
            scale: videoScale,
            filter: videoBlur,
            opacity: videoOpacity
          }}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover brightness-[0.75] contrast-[1.05]"
          >
            <source src="/HOMEPAGE.mp4" type="video/mp4" />
          </video>
          {/* Depth Gradient Overlay */}
          <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.85)_100%] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black pointer-events-none" />
        </motion.div>

        {/* Ambient Overlay Glow (Volumetric light source effect) */}
        <div className="absolute top-[35%] w-[80%] h-[35%] rounded-full bg-violet-glow/5 blur-[120px] pointer-events-none z-5" />

        {/* Dynamic Scene Containers */}
        <div className="relative z-10 w-full max-w-5xl px-6 text-center">

          {/* Scene 1: Introduction */}
          <motion.div
            style={{ opacity: opacity1, y: y1 }}
            className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none px-4"
          >
            <h2 className="text-2xl sm:text-4xl md:text-7xl font-extralight tracking-wide leading-tight text-white/95 text-center">
              What if your <span className="italic font-serif text-violet-glow/90 font-normal">dreams</span> <br /> could be seen?
            </h2>
          </motion.div>

          {/* Scene 2: The Trace */}
          <motion.div
            style={{ opacity: opacity2, y: y2 }}
            className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none px-4"
          >
            <h2 className="text-2xl sm:text-4xl md:text-7xl font-extralight tracking-wide leading-tight text-white/95 text-center">
              Every dream <span className="italic font-serif text-moonlight-blue/90 font-normal">leaves a trace</span>.
            </h2>
          </motion.div>

          {/* Scene 3: The Revelation */}
          <motion.div
            style={{ opacity: opacity3, y: y3 }}
            className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none px-4"
          >
            <h2 className="text-2xl sm:text-4xl md:text-7xl font-extralight tracking-wide leading-tight text-white/95 text-center">
              Noctis reveals what your <br />
              <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-violet-glow to-moonlight-blue font-normal">
                mind creates
              </span>.
            </h2>
          </motion.div>

          {/* Scene 4: The Invitation / CTA */}
          <motion.div
            style={{ opacity: opacity4, y: y4 }}
            className="absolute inset-0 flex flex-col justify-center items-center px-4"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl leading-none font-medium tracking-tight mb-4 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] font-sans text-center">
              Visualize the unseen.
            </h1>
            <p className="text-xs sm:text-lg md:text-xl text-white/50 mb-10 max-w-2xl font-light tracking-wide text-center px-4">
              An atmospheric entry point to decrypt the subconscious, transform memories, and experience visual storytelling.
            </p>

            <motion.button 
              onClick={onStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-white text-black rounded-full font-medium tracking-wider uppercase text-[10px] sm:text-xs overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(139,92,246,0.4)] cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-3 font-semibold">
                Visualize My Dream
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-glow via-moonlight-blue to-violet-glow opacity-0 group-hover:opacity-15 transition-opacity duration-700" />
            </motion.button>
          </motion.div>

        </div>

        {/* Narrative Dot Indicators on Right Edge */}
        <div className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 sm:gap-5 z-40">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => scrollToScene(idx)}
              className="group flex items-center gap-3 sm:gap-4 text-right cursor-pointer focus:outline-none"
            >
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-white/0 group-hover:text-white/40 transition-all duration-300 hidden sm:inline">
                {idx === 0 && "Inquire"}
                {idx === 1 && "Trace"}
                {idx === 2 && "Reveal"}
                {idx === 3 && "Awaken"}
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                <div className={`rounded-full transition-all duration-500 ${
                  currentScene === idx 
                    ? "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-violet-glow shadow-[0_0_10px_rgba(139,92,246,0.8)]" 
                    : "w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/20 group-hover:bg-white/50"
                }`} />
              </div>
            </button>
          ))}
        </div>

        {/* Scroll helper indicators */}
        <AnimatePresence>
          {currentScene < 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => scrollToScene(currentScene + 1)}
              className="absolute bottom-8 sm:bottom-10 flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer z-30 group"
            >
              <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/40 group-hover:text-white/70 transition-colors">
                Scroll to delve
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/30 group-hover:text-white/70 transition-colors" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
