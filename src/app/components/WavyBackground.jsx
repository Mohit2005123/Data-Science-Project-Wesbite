export default function WavyBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(101,76,255,0.6),transparent_70%),radial-gradient(800px_400px_at_120%_10%,rgba(0,200,255,0.55),transparent_70%),radial-gradient(800px_400px_at_-20%_10%,rgba(255,0,128,0.5),transparent_70%)]" />
      <svg className="absolute -top-48 left-1/2 h-[120vh] w-[160vw] -translate-x-1/2 opacity-45" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <path fill="none" stroke="url(#g1)" strokeWidth="3" d="M0,300 C150,200 350,400 500,300 C650,200 850,400 1000,300 C1150,200 1350,400 1500,300" />
        <path fill="none" stroke="url(#g1)" strokeWidth="3" opacity="0.8" d="M0,340 C160,240 340,460 520,340 C680,240 860,440 1040,340 C1180,260 1360,420 1520,340" />
        <path fill="none" stroke="url(#g1)" strokeWidth="3" opacity="0.5" d="M0,380 C140,300 360,420 520,380 C700,320 880,420 1040,380 C1200,340 1400,420 1600,380" />
      </svg>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.75)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(120deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_2px,transparent_2px,transparent_6px)]" />
    </div>
  );
}

