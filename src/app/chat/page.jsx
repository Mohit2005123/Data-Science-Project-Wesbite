"use client";

import { useEffect, useRef, useState } from "react";

export default function VoiceChatPage() {
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState([]); // {role:'user'|'assistant', text:string}
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const mrRef = useRef(null);
  const chunksRef = useRef([]);
  const listRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mrRef.current && mrRef.current.state !== "inactive") mrRef.current.stop();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function getHindiVoice() {
    if (typeof window === "undefined" || !window.speechSynthesis) return null;
    const synth = window.speechSynthesis;
    const voices = synth.getVoices ? synth.getVoices() : [];
    // Prefer hi-IN, else any hi-*
    const exact = voices.find((v) => v.lang?.toLowerCase() === "hi-in");
    if (exact) return exact;
    return voices.find((v) => v.lang?.toLowerCase().startsWith("hi")) || null;
  }

  function speakText(text, index) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    const voice = getHindiVoice();
    if (voice) utter.voice = voice;
    utter.lang = voice?.lang || "hi-IN";
    utter.rate = 1;
    utter.pitch = 1;
    utter.onend = () => setSpeakingIndex((curr) => (curr === index ? null : curr));
    utter.onerror = () => setSpeakingIndex((curr) => (curr === index ? null : curr));
    setSpeakingIndex(index);
    synth.speak(utter);
  }

  function toggleSpeak(index, text) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    if (speakingIndex === index) {
      synth.cancel();
      setSpeakingIndex(null);
    } else {
      // Some browsers load voices asynchronously
      const voices = synth.getVoices();
      if (!voices || voices.length === 0) {
        const handler = () => {
          speakText(text, index);
          synth.removeEventListener("voiceschanged", handler);
        };
        synth.addEventListener("voiceschanged", handler);
        // Fallback: still attempt immediate speak
        speakText(text, index);
      } else {
        speakText(text, index);
      }
    }
  }

  function isStopCommand(text) {
    const normalized = (text || "").toLowerCase();
    const stopPhrases = [
      "रुको",
      "बंद करो",
      "चुप",
      "चुप हो जाओ",
      "मत बोलो",
      "रुक जाओ",
      "stop",
      "be quiet",
      "shut up",
    ];
    return stopPhrases.some((p) => normalized.includes(p));
  }

  async function startRecording() {
    // Stop any ongoing TTS when user begins a new recording
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
    chunksRef.current = [];

    mr.ondataavailable = (e) => e.data?.size && chunksRef.current.push(e.data);

    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const form = new FormData();
      form.append("file", blob, "speech.webm");

      // 1) Hindi transcription (Sarvam)
      const tr = await fetch("/api/transcribe", { method: "POST", body: form });
      const tjson = await tr.json();
      if (!tr.ok) return alert("Transcription failed: " + (tjson?.error || "unknown"));

      const hindiText = (tjson?.transcript || "").trim();
      if (!hindiText) return alert("Empty transcription received.");

      // Handle voice stop commands to cancel speaking
      if (isStopCommand(hindiText)) {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        setSpeakingIndex(null);
        setMessages((m) => [
          ...m,
          { role: "user", text: hindiText },
          { role: "assistant", text: "ठीक है, मैं बोलना रोक देता हूँ।" },
        ]);
        return;
      }

      setMessages((m) => [...m, { role: "user", text: hindiText }]);

      // 2) Hindi-only LLM answer (Groq)
      const gr = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: hindiText }),
      });
      const gjson = await gr.json();
      if (!gr.ok) return alert("LLM request failed: " + (gjson?.error || "unknown"));

      setMessages((m) => [...m, { role: "assistant", text: (gjson.reply || "").trim() }]);
    };

    mrRef.current = mr;
    mr.start(200);
    setRecording(true);
  }

  function stopRecording() {
    if (mrRef.current && mrRef.current.state !== "inactive") {
      mrRef.current.stop();
      mrRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    setRecording(false);
  }

  return (
    <main className="min-h-dvh relative text-neutral-100 flex items-center justify-center p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(16,185,129,0.15),transparent_60%),radial-gradient(40%_40%_at_100%_100%,rgba(99,102,241,0.15),transparent_60%),linear-gradient(180deg,#060606, #0b0b0b)]" />

      <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <header className="px-5 sm:px-7 py-5 flex items-center justify-between gap-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400/90 to-indigo-500/90 text-black grid place-items-center shadow-lg shadow-emerald-500/20">
              🎙️
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">हिंदी वॉइस चैट</h1>
              <p className="text-xs text-neutral-300/80">बोलकर पूछें और तुरंत जवाब पाएं</p>
            </div>
          </div>
          <div className={`text-xs px-2.5 py-1 rounded-full border ${recording ? "border-rose-400/40 bg-rose-400/10 text-rose-200" : "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"}`}>
            {recording ? "रिकॉर्डिंग चालू" : "रिकॉर्डिंग बंद"}
          </div>
        </header>

        <section className="h-[62vh] sm:h-[64vh] md:h-[66vh] overflow-hidden">
          <div ref={listRef} className="h-full overflow-y-auto px-4 sm:px-6 py-4 space-y-3 scroll-smooth">
            {messages.length === 0 && (
              <div className="h-full w-full grid place-items-center">
                <div className="text-center max-w-md">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-white/10 grid place-items-center border border-white/10">
                    💬
                  </div>
                  <p className="text-sm text-neutral-200/90 leading-relaxed">
                    शुरू करने के लिए नीचे माइक्रोफ़ोन दबाएँ। आप हिंदी में कोई भी सवाल पूछ सकते हैं।
                  </p>
                </div>
              </div>
            )}

            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <div className="h-8 w-8 rounded-full bg-indigo-400/90 text-black grid place-items-center shadow ring-1 ring-white/20">🤖</div>
                  )}
                  <div className={`${isUser ? "bg-emerald-500 text-emerald-950" : "bg-white/8 text-neutral-100 border border-white/10"} max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-md ${isUser ? "rounded-br-sm" : "rounded-bl-sm"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[10px] uppercase tracking-wide opacity-70">
                        {isUser ? "आप" : "सहायक"}
                      </div>
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => toggleSpeak(i, m.text)}
                          aria-label={speakingIndex === i ? "पढ़ना रोकें" : "जवाब सुनें"}
                          title={speakingIndex === i ? "पढ़ना रोकें" : "जवाब सुनें"}
                          className="pointer-events-auto ml-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] hover:bg-white/10 transition-colors"
                        >
                          <span className="text-xs">{speakingIndex === i ? "⏹" : "🔊"}</span>
                          <span className="opacity-80">{speakingIndex === i ? "रोकें" : "सुनें"}</span>
                        </button>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed text-sm">{m.text}</div>
                  </div>
                  {isUser && (
                    <div className="h-8 w-8 rounded-full bg-emerald-400/90 text-black grid place-items-center shadow ring-1 ring-white/20">🧑</div>
                  )}
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
        </section>

        <footer className="px-5 sm:px-7 py-5 border-t border-white/10 flex items-center justify-between gap-4">
          <div className="text-[11px] text-neutral-300/80 hidden sm:block">
            ऑडियो MediaRecorder से WebM/Opus में रिकॉर्ड होकर सुरक्षित रूप से भेजा जाता है।
          </div>
          <div className="flex items-center gap-3">
            {!recording ? (
              <button
                onClick={startRecording}
                aria-label="रिकॉर्डिंग शुरू करें"
                className="relative group h-12 w-12 grid place-items-center rounded-full bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/40 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
              >
                <span className="absolute -inset-2 rounded-full bg-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="translate-y-[1px]">
                  <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2ZM11 19.95V22h2v-2.05a9.003 9.003 0 0 0 7-8.95h-2a7 7 0 1 1-14 0H2a9.003 9.003 0 0 0 9 8.95Z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                aria-label="रिकॉर्डिंग रोकें"
                className="relative h-12 w-12 grid place-items-center rounded-full bg-rose-500 text-rose-950 shadow-lg shadow-rose-500/30 focus:outline-none focus:ring-2 focus:ring-rose-300/60"
              >
                <span className="absolute -inset-2 rounded-full animate-ping bg-rose-400/30" />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="translate-y-[1px]">
                  <rect x="7" y="7" width="10" height="10" rx="2" />
                </svg>
              </button>
            )}
          </div>
        </footer>
      </div>

      {/* Auto-scroll to bottom when messages change */}
      {(() => {
        // Using an inline effect to keep the component single-file without additional hooks
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        }, [messages]);
        return null;
      })()}
    </main>
  );
}
