"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface DreamInputProps {
  onSubmit: (dream: string) => void;
  isProcessing: boolean;
}

export default function DreamInput({ onSubmit, isProcessing }: DreamInputProps) {
  const [dream, setDream] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Voice Input (Web Speech API integration)
  const toggleRecording = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    if (!isRecording) {
      setIsRecording(true);
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDream((prev) => prev + (prev ? " " : "") + transcript);
        setIsRecording(false);
        // Trigger particle burst on voice input success
        spawnBurst();
      };
      recognition.onerror = () => {
        setIsRecording(false);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
    } else {
      setIsRecording(false);
      recognition.stop();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dream.trim() && !isProcessing) {
      onSubmit(dream);
    }
  };

  // Canvas particle system variables
  const particlesRef = useRef<any[]>([]);

  const spawnBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const count = 30;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      particlesRef.current.push({
        x: canvas.width / 2 / (window.devicePixelRatio || 1),
        y: canvas.height / 2 / (window.devicePixelRatio || 1),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        alpha: 1,
        color: i % 2 === 0 ? "139, 92, 246" : "96, 165, 250", // violet or blue
        life: 1.0,
        decay: 0.015 + Math.random() * 0.02,
      });
    }
  };

  // Particle System Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize background floating dust particles
    const floatCount = 60;
    const floatingParticles: any[] = [];
    for (let i = 0; i < floatCount; i++) {
      floatingParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Draw floating ambient particles
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      floatingParticles.forEach((p) => {
        p.x += p.vx * (isTyping ? 2.5 : 1);
        p.y += p.vy * (isTyping ? 2.5 : 1);

        // Boundary checks
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 2. Draw typed ripple particles
      const activeParticles = particlesRef.current;
      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const p = activeParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          activeParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life * p.alpha;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `rgba(${p.color}, 0.8)`);
        gradient.addColorStop(0.5, `rgba(${p.color}, 0.2)`);
        gradient.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTyping]);

  const handleInputChange = (val: string) => {
    setDream(val);

    // Spawn 1-2 particles on character addition
    const canvas = canvasRef.current;
    if (canvas && val.length > dream.length) {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // Spawn near text input container
      const containerX = w / 2;
      const containerY = h / 2 + 50;

      for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2;
        particlesRef.current.push({
          x: containerX + (Math.random() - 0.5) * 400,
          y: containerY + (Math.random() - 0.5) * 150,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2 + 0.8,
          alpha: 0.8,
          color: Math.random() > 0.5 ? "139, 92, 246" : "96, 165, 250",
          life: 1.0,
          decay: 0.02 + Math.random() * 0.03,
        });
      }
    }

    // Set typing status to accelerate background particles
    setIsTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // Determine dynamic glows based on text size and focus
  const glowScale = 1 + Math.min(dream.length / 400, 0.4);
  const glowOpacity = isFocused ? 0.35 : 0.18;

  const handlePointerDown = (e: React.MouseEvent<any> | React.TouchEvent<any>) => {
    // Determine pointer coordinates
    let clientX = 0;
    let clientY = 0;
    if ("touches" in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Spawn stardust burst at touch/click point
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2 + 0.8,
        alpha: 0.9,
        color: Math.random() > 0.5 ? "139, 92, 246" : "96, 165, 250",
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02,
      });
    }
  };

  return (
    <section 
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      className="relative min-h-[100dvh] w-full flex items-center justify-center bg-black overflow-hidden select-none"
    >
      
      {/* Background Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none w-full h-full block"
      />

      {/* Shifting Volumetric Ambient Lights */}
      <motion.div
        animate={{
          scale: glowScale,
          opacity: glowOpacity,
          x: isFocused ? [0, -10, 10, 0] : 0,
          y: isFocused ? [0, 10, -10, 0] : 0,
        }}
        transition={{
          scale: { duration: 0.6, ease: "easeOut" },
          opacity: { duration: 0.5 },
          x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute w-[300px] h-[300px] sm:w-[650px] sm:h-[650px] rounded-full bg-radial from-violet-glow/30 via-moonlight-blue/5 to-transparent blur-[140px] pointer-events-none z-1"
      />

      <div className="relative z-10 w-full max-w-3xl px-4 sm:px-6 py-12 sm:py-20 flex flex-col justify-center">
        
        {/* Cinematic Header */}
        <div className="text-center mb-8 sm:mb-10">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ duration: 1 }}
            className="text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-white mb-3 sm:mb-4 font-mono"
          >
            The Subconscious Journal
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-5xl font-extralight tracking-wide text-white leading-tight font-sans"
          >
            Recall your <span className="italic font-serif text-violet-glow font-normal">dream</span>
          </motion.h2>
        </div>

        {/* Glass Journal Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="relative group"
          onClick={(e) => e.stopPropagation()} // Prevent double triggers on tapping form fields
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Pulsating Ink Border Glow */}
          <div className={cn(
            "absolute -inset-0.5 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-all duration-1000 bg-gradient-to-r from-violet-glow to-moonlight-blue",
            isFocused ? "opacity-60 scale-[1.01]" : ""
          )} />
          
          <div className={cn(
            "relative glass rounded-2xl p-6 sm:p-8 transition-all duration-700 bg-black/60 backdrop-blur-xl border border-white/5",
            isFocused ? "bg-black/80 border-white/10" : ""
          )}>
            <textarea
              value={dream}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isProcessing}
              placeholder="I was walking along the shore of a glowing violet ocean, watching the water float up into the sky like stardust..."
              className="w-full h-36 sm:h-44 bg-transparent text-white/90 placeholder:text-white/20 resize-none outline-none text-base sm:text-lg md:text-xl leading-relaxed font-light scrollbar-none font-sans"
            />

            <div className="flex items-center justify-between mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/5">
              
              {/* Voice input indicator */}
              <button
                type="button"
                onClick={toggleRecording}
                disabled={isProcessing}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-500 cursor-pointer border border-white/5 text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5",
                  isRecording 
                    ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20 hover:text-red-300" 
                    : ""
                )}
              >
                <div className="relative">
                  <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
                  {isRecording && (
                    <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
                  )}
                </div>
                <span className="text-[10px] sm:text-xs tracking-wider uppercase font-semibold">
                  {isRecording ? "Listening" : "Speak"}
                </span>
              </button>

              {/* Submit / Visualize */}
              <button
                type="submit"
                disabled={!dream.trim() || isProcessing}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-black rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase overflow-hidden transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-white/95",
                  dream.trim() ? "hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]" : ""
                )}
              >
                <span>Visualize</span>
                <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>
        </motion.form>

        {/* Narrative footer hint */}
        <motion.p
          animate={{ opacity: isFocused ? 0.35 : 0.15 }}
          className="text-center text-[10px] sm:text-xs text-white mt-6 sm:mt-8 tracking-widest uppercase font-mono font-light pointer-events-none"
        >
          {dream.length} characters inscribed
        </motion.p>

      </div>
    </section>
  );
}
