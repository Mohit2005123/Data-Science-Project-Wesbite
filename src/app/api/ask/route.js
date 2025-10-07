import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import axios from "axios";
export const runtime = "nodejs";

const MODEL = "openai/gpt-oss-120b";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt (Hindi) is required" }, { status: 400 });
    }

    const system = [
      "आप केवल हिंदी में उत्तर दें।",
      "यदि इनपुट किसी और भाषा में हो, तो उसे मानसिक रूप से हिंदी में बदलकर केवल हिंदी में उत्तर दें।",
      "अंग्रेज़ी शब्द/वाक्य बिलकुल न जोड़ें।",
      "उत्तर विस्तृत और सूचनाप्रद हो, जहाँ संभव हो वहाँ अतिरिक्त संदर्भ/उदाहरण भी दें।",
      "मार्कडाउन, बुलेट पॉइंट, शीर्षक या सजावटी चिन्ह न दें; केवल सादा पाठ लिखें।",
      "तारांकन (*) अथवा किसी भी प्रकार के विशेष चिन्हों का प्रयोग न करें।"
    ].join(" ");
    // Add a separate instruction about links to encourage helpful plain-text URLs
    const linkInstruction = [
      "जहाँ उपयुक्त हो, उत्तर के अंत में 2-4 विश्वसनीय वेब लिंक (सरकारी/आधिकारिक/प्रामाणिक स्रोत) साधारण URLs के रूप में अलग-अलग पंक्तियों में दें।",
      "लिंक्स के साथ कोई बुलेट, शीर्षक या सजावटी स्वरूप न दें—केवल URLs।"
    ].join(" ");
    const fullSystem = `${system} ${linkInstruction}`;

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
        normalized.includes(altTarget) ||
        normalized.includes("पर्याप्त")
      ) {
        reply = ""; // force fallback below
      }
    } catch (_) {
      // ignore and fallback to Groq
    }

    // If RAG didn't produce a reply, fallback to Groq (Hindi-only, plain text)
    if (!reply) {
      const apiKey = process.env.GROQ_API_KEY || "";
      if (!apiKey) {
        return NextResponse.json({ error: "GROQ_API_KEY is not configured on the server" }, { status: 500 });
      }

      const groq = new Groq({ apiKey });
      const chatCompletion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: fullSystem },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 1200,
      });
      reply = (chatCompletion?.choices?.[0]?.message?.content || "")
        .replace(/\*/g, "")
        .trim();
    }

    return NextResponse.json({ reply: reply });
  } catch (err) {
    return NextResponse.json({ error: err?.message || "unknown error" }, { status: 500 });
  }
}
