"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-3 flex h-12 items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/5">
          <a href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide">
            <span className="inline-block size-2 rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
            Hindi Spoken Query
          </a>

          <div className="hidden items-center gap-6 sm:flex">
            <a href="/" className="text-sm text-white/80 hover:text-white">Home</a>
            <a href="/" className="text-sm text-white/80 hover:text-white">Features</a>
            <a href="/" className="text-sm text-white/80 hover:text-white">How it works</a>
            <a href="/" className="text-sm text-white/80 hover:text-white">Privacy</a>
          </div>

          <div className="hidden sm:block">
            <a href="/chat" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90">Get Started</a>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-white/80 hover:text-white"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="sm:hidden mt-2 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur">
            <a onClick={() => setOpen(false)} href="/" className="block rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white">Home</a>
            <a onClick={() => setOpen(false)} href="/" className="block rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white">Features</a>
            <a onClick={() => setOpen(false)} href="/" className="block rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white">How it works</a>
            <a onClick={() => setOpen(false)} href="/" className="block rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white">Privacy</a>
            <a onClick={() => setOpen(false)} href="/" className="mt-1 block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-black hover:bg-white/90">Get Started</a>
          </div>
        )}
      </nav>
    </header>
  );
}


