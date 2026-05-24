"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DreamInputProps {
  onSubmit: (dream: string) => void;
  isProcessing: boolean;
}

export default function DreamInput({ onSubmit, isProcessing }: DreamInputProps) {
  const [dream, setDream] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dream.trim() && !isProcessing) {
      onSubmit(dream);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, integrate with Web Speech API
  };

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium mb-4 text-white">Describe your dream</h2>
          <p className="text-white/50">Speak or type freely. The AI will interpret the subconscious symbols.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative group">
          {/* Animated border glow */}
          <div className={cn(
            "absolute -inset-0.5 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-1000",
            isProcessing ? "bg-violet-glow animate-pulse" : "bg-white/20"
          )} />
          
          <div className="relative glass-card rounded-2xl p-6 transition-all duration-500 group-hover:bg-charcoal/80">
            <textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              disabled={isProcessing}
              placeholder="I was walking through an endless corridor of mirrors..."
              className="w-full h-40 bg-transparent text-white/90 placeholder:text-white/30 resize-none outline-none text-lg md:text-xl leading-relaxed font-light"
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={toggleRecording}
                disabled={isProcessing}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                  isRecording 
                    ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                    : "hover:bg-white/5 text-white/50 hover:text-white"
                )}
              >
                <div className="relative">
                  <Mic className="w-5 h-5 relative z-10" />
                  {isRecording && (
                    <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
                  )}
                </div>
                <span className="text-sm font-medium">
                  {isRecording ? "Listening..." : "Voice Input"}
                </span>
              </button>

              <button
                type="submit"
                disabled={!dream.trim() || isProcessing}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Visualize</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Processing State Overlay (Abstract Visuals) */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-matte-black/90 backdrop-blur-xl"
            >
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 border border-white/10 rounded-full absolute"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="w-64 h-64 border border-violet-glow/20 rounded-full absolute"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-32 h-32 bg-violet-glow/30 rounded-full blur-2xl absolute"
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 4, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 bg-moonlight-blue/40 rounded-full blur-xl absolute"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-32 text-center"
              >
                <h3 className="text-xl font-medium tracking-wide text-white mb-2">Analyzing Subconscious Patterns</h3>
                <p className="text-white/50 text-sm">Extracting symbolic meaning and generating visual representations...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
