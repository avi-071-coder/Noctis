export default function Footer() {
  return (
    <footer className="w-full relative py-12 px-6 bg-black/40 backdrop-blur-md border-t border-white/5 z-20">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-glow/65 shadow-[0_0_8px_rgba(139,92,246,0.65)]" />
          <span className="text-[10px] tracking-[0.3em] font-semibold text-white/70 uppercase">NOCTIS ENGINE</span>
        </div>
        
        <div className="text-white/40 text-[10px] tracking-wider font-light text-center md:text-right">
          <p className="uppercase">Exploring the intersection of consciousness and neural aesthetics.</p>
          <p className="mt-1 opacity-50">© {new Date().getFullYear()} NOCTIS. ALL SUBCONSCIOUS DATA ENCRYPTED.</p>
        </div>
      </div>
    </footer>
  );
}
