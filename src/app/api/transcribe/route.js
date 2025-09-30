import { NextResponse } from "next/server";

export const runtime = "nodejs"; // fine on Node; also works on Edge since no Node APIs used

export async function POST(req) {
  try {
    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("multipart/form-data")) {
      return NextResponse.json({ error: "multipart/form-data required" }, { status: 400 });
    }

    const apiKey = process.env.SARVAM_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json({ error: "SARVAM_API_KEY is not configured on the server" }, { status: 500 });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!file) return NextResponse.json({ error: "file field is required" }, { status: 400 });

    // Forward the original web File to Sarvam as multipart/form-data
    const sarvamForm = new FormData();
    sarvamForm.append("file", file, file.name || "audio.webm");
    sarvamForm.append("language_code", "hi-IN");       // force Hindi
    sarvamForm.append("model", "saarika:v2.5");        // default model per docs

    const r = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: { "api-subscription-key": apiKey },
      body: sarvamForm,
    });

    if (!r.ok) {
      const txt = await r.text();
      return NextResponse.json({ error: "Sarvam STT failed", details: txt }, { status: 502 });
    }

    const data = await r.json();
    console.log(data);
    return NextResponse.json({
      transcript: data?.transcript || "",
      language_code: data?.language_code || "hi-IN",
    });
  } catch (err) {
    const message = typeof err?.message === "string" ? err.message : "unknown error";
    console.error("Sarvam STT error:", message);
    return NextResponse.json({ error: `transcribe failed: ${message}` }, { status: 500 });
  }
}
