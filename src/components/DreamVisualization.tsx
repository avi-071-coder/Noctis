"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { type DreamData } from "@/types";
import { Sparkles, Brain, Clock, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  dream: DreamData;
}

export default function DreamVisualization({ dream }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [dream.imageUrl]);

  return (
    <div className="w-full flex flex-col items-center pt-32 relative">

        {/* Header Text Section */}
        <section className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-white/5 mb-8 shadow-[0_0_30px_rgba(139,92,246,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-moonlight-blue animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/90">
              AI Generated Reality
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-[5.5rem] leading-tight font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 mb-8 drop-shadow-xl"
          >
            {dream.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-2xl text-white/60 max-w-3xl font-light leading-relaxed tracking-wide"
          >
            {dream.summary}
          </motion.p>
        </section>

        {/* Cinematic Image Card Section */}
        <section className="w-full max-w-6xl px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden glass-card shadow-[0_0_50px_rgba(139,92,246,0.15)] group"
        >
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-charcoal z-10 p-6 text-center">
              <span className="text-white/40 text-sm tracking-widest uppercase mb-2">Image Generation Failed</span>
              <p className="text-white/30 text-xs">The visualizer API timed out or blocked the request.</p>
            </div>
          )}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-charcoal z-10">
              <Loader2 className="w-10 h-10 text-violet-glow animate-spin mb-4" />
              <span className="text-white/40 text-sm tracking-widest uppercase animate-pulse">
                Manifesting Visuals...
              </span>
            </div>
          )}
          {!imageError && (
            <img 
              src={dream.imageUrl} 
              alt={dream.title}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={cn("w-full h-full object-cover transition-all duration-1000 transform group-hover:scale-105", imageLoaded ? "opacity-100" : "opacity-0")}
            />
          )}
          {/* Subtle inner shadow/vignette for cinematic feel */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </motion.div>
      </section>


      {/* Scroll indicator below the image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="animate-bounce text-white/30 mb-24"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>

      {/* Analysis Section */}
      <section className="w-full max-w-5xl px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Emotions Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Brain className="w-6 h-6 text-violet-glow" />
            <h3 className="text-2xl font-medium text-white">Emotional Profile</h3>
          </div>
          
          <div className="space-y-6">
            {dream.emotions.map((emotion, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80 capitalize">{emotion.name}</span>
                  <span className="text-white/50">{emotion.intensity}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${emotion.intensity}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: emotion.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Symbols Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-moonlight-blue" />
            <h3 className="text-2xl font-medium text-white">Subconscious Symbols</h3>
          </div>

          <div className="space-y-6">
            {dream.symbols.map((symbol, idx) => (
              <div key={idx} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <h4 className="text-lg font-medium text-white mb-2 capitalize">{symbol.name}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{symbol.meaning}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Storyboard Section */}
      <section className="w-full max-w-5xl px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-medium text-white mb-4">Cinematic Reconstruction</h2>
          <p className="text-white/50">A sequential breakdown of the dream's events.</p>
        </div>

        <div className="space-y-8 relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/5 hidden md:block" />
          
          {dream.storyboard.map((scene, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col md:flex-row gap-6 relative"
            >
              <div className="hidden md:flex flex-none w-16 h-16 rounded-full glass items-center justify-center relative z-10">
                <Clock className="w-6 h-6 text-white/50" />
              </div>
              <div className="glass-card flex-1 p-6 rounded-2xl group hover:bg-white/5 transition-colors">
                <h4 className="text-lg font-medium text-white mb-2">{scene.scene}</h4>
                <p className="text-white/60 leading-relaxed">{scene.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
