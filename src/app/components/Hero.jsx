"use client";

import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <section className="relative min-h-[85svh] flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur">
        Hindi Spoken Query System
      </div>
      <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl">
        Empowering Women with Voice
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-balance text-white/70 sm:text-lg">
        Ask questions in Hindi, hands‑free. Private, safe, and accessible—built to
        support women seeking quick answers with confidence.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={() => router.push("/chat")}
          className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-semibold transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <span className="size-2 rounded-full bg-green-500" />
          Start speaking
        </button>
        <a
          href="#learn-more"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
        >
          Learn more
        </a>
      </div>
    </section>
  );
}


