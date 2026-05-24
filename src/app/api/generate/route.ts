import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { type DreamData } from "@/types";

// Initialize Gemini SDK
// Note: Requires GEMINI_API_KEY to be set in .env.local
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { dream } = await req.json();

    if (!dream) {
      return NextResponse.json({ error: "Dream text is required" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `You are an expert dream analyst and cinematic director. 
    Analyze the following dream and return a JSON object with this exact structure:
    {
      "title": "A cinematic, poetic title for the dream",
      "summary": "A 2-3 sentence surreal, poetic summary of the dream.",
      "imagePrompt": "A highly detailed, cinematic prompt for an AI image generator (like Midjourney) that perfectly captures the surreal, atmospheric essence of the dream. Do NOT mention words like 'image', just the visual description.",
      "emotions": [
        { "name": "emotion name (e.g. Wonder, Fear)", "intensity": number 0-100, "color": "hex color code representing the emotion (e.g. #8b5cf6)" }
      ],
      "symbols": [
        { "name": "symbol from the dream", "meaning": "deep subconscious meaning" }
      ],
      "storyboard": [
        { "scene": "Scene Name", "description": "Cinematic description of what happens" }
      ]
    }

    Make sure you return exactly 3 emotions, 3-4 symbols, and 3-4 storyboard scenes.

    Dream: "${dream}"`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsedData = JSON.parse(text);

    // Use Pollinations.ai for free, instant image generation based on the imagePrompt
    // Clean the prompt: remove special characters and truncate to avoid URL length limits
    const cleanPrompt = parsedData.imagePrompt.replace(/[^a-zA-Z0-9., ]/g, "").substring(0, 500);
    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(cleanPrompt + ", cinematic lighting, surreal, 8k");
    const dynamicImageUrl = `/api/image?prompt=${encodedPrompt}&seed=${seed}`;

    const responseData: DreamData = {
      id: crypto.randomUUID(),
      originalText: dream,
      imageUrl: dynamicImageUrl,
      title: parsedData.title,
      summary: parsedData.summary,
      emotions: parsedData.emotions,
      symbols: parsedData.symbols,
      storyboard: parsedData.storyboard,
      date: new Date().toISOString()
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Error generating dream:", error);
    return NextResponse.json({ error: "Failed to generate dream" }, { status: 500 });
  }
}
