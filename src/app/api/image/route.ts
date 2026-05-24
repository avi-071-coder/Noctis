import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const prompt = searchParams.get("prompt");

    if (!prompt) {
      return new NextResponse("Missing prompt", { status: 400 });
    }

    const seed = searchParams.get("seed") || Math.floor(Math.random() * 1000000);
    // Use the raw image API endpoint, NOT the web /p/ endpoint which returns HTML
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1920&height=1080&nologo=true&seed=${seed}`;

    console.log("Fetching image from Pollinations API:", url);
    const response = await fetch(url, {
      cache: "no-store", // Force Next.js to not cache the fetch response
      headers: {
        "Accept": "image/jpeg, image/png, image/*",
        "User-Agent": "Noctis-AI-Engine",
        "Cache-Control": "no-cache"
      }
    });
    
    if (!response.ok) {
      console.error("Pollinations failed:", response.statusText);
      return new NextResponse("Failed to fetch image", { status: 500 });
    }
    
    const buffer = await response.arrayBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      }
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
