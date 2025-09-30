import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import axios from "axios";
import { Content } from "next/font/google";
export const runtime = "nodejs";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "openai/gpt-oss-120b"

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt (Hindi) is required" }, { status: 400 });
    }

    const system = [
      "आप केवल हिंदी में उत्तर दें।",
      "यदि इनपुट किसी और भाषा में हो, तो उसे मानसिक रूप से हिंदी में बदलकर केवल हिंदी में उत्तर दें।",
      "अंग्रेज़ी शब्द/वाक्य बिलकुल न जोड़ें।"
    ].join(" ");

    // Try Legal RAG API first
    let reply = "";
    try {
      const answer = await axios.post(
        "https://legal-rag-api-oe37.onrender.com/rag",
        { query: prompt },
        { headers: { "Content-Type": "application/json" } }
      );
      reply = (answer?.data?.response || "").trim();

      // If RAG says insufficient information in provided documents, trigger Groq fallback
      const normalized = reply
        .replace(/[\s\n\r\t]+/g, " ")
        .replace(/[.,!?؛:|()/\\~`'"\-]|[।]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const target = "प्रदत्त दस्तावेज़ों में पर्याप्त जानकारी उपलब्ध नहीं है";
      const altTarget = "प्रदत्त दस्तावेजों में पर्याप्त जानकारी उपलब्ध नहीं है"; // without nukta on ज़
      if (
        normalized.includes(target) ||
        normalized.includes(altTarget)
      ) {
        reply = ""; // force fallback below
      }
    } catch (_) {
      // ignore and fallback to Groq
    }

    // If RAG didn't produce a reply, fallback to Groq (Hindi-only, plain text)
    if (!reply) {
      const chatCompletion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      });
      reply = (chatCompletion?.choices?.[0]?.message?.content || "").trim();
    }

    return NextResponse.json({ reply: reply });
  } catch (err) {
    return NextResponse.json({ error: err?.message || "unknown error" }, { status: 500 });
  }
}
