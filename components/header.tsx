export function Header() {
  return (
    <header className="w-full flex items-center justify-between py-5 px-5 sm:px-8 max-w-2xl mx-auto z-10">
      {/* Liquid Glass duvansi brand mark */}
      <div className="liquid-glass-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full select-none cursor-default">
        <span className="font-semibold text-xs tracking-[0.2em] uppercase text-white/90">
          duvansi
        </span>
      </div>

      {/* Online indicator badge */}
      <div className="liquid-glass-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium text-zinc-400 select-none cursor-default">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
        </span>
        <span className="text-[10.5px] tracking-wide text-zinc-400">Online</span>
      </div>
    </header>
  );
}
