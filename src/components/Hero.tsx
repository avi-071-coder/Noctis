"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[1000px] h-[1000px] bg-violet-glow/30 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-[50%] left-[10%] w-[800px] h-[800px] bg-moonlight-blue/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="z-10 text-center max-w-4xl px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-white/5 mb-8 shadow-[0_0_30px_rgba(139,92,246,0.15)]"
        >
          <Sparkles className="w-4 h-4 text-violet-glow animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase text-white/90">
            Noctis Engine v1.0
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-6xl md:text-[7.5rem] leading-none font-medium tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 drop-shadow-2xl"
        >
          Visualize the <br className="hidden md:block" /> subconscious.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-2xl text-white/50 mb-14 max-w-3xl mx-auto font-light leading-relaxed tracking-wide"
        >
          Transform dreams into cinematic AI-generated realities. A premium fusion of subconscious exploration and profound visual storytelling.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <button 
            onClick={onStart}
            className="group relative px-10 py-5 bg-white text-black rounded-full font-semibold tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3">
              Enter the Dream
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white via-violet-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </motion.div>
      </div>

      {/* Atmospheric bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-matte-black via-matte-black/80 to-transparent pointer-events-none" />
    </section>
  );
}
