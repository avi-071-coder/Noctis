export default function Footer() {
  return (
    <footer className="w-full relative py-12 px-6 mt-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-violet-glow/50 animate-pulse-slow" />
          <span className="text-white/80 font-medium tracking-wide">NOCTIS AI</span>
        </div>
        
        <div className="text-white/40 text-sm font-light text-center md:text-left">
          <p>Exploring the intersection of consciousness and artificial intelligence.</p>
          <p className="mt-1 opacity-60">© {new Date().getFullYear()} Noctis Engine. Subconscious data remains private.</p>
        </div>
      </div>
    </footer>
  );
}
