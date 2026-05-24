# Noctis: AI Dream Visualizer

Noctis is a high-end, cinematic web application that transforms your textual dream descriptions into stunning visual realities. It acts as an interactive bridge between human subconsciousness and artificial intelligence.

By simply describing what you experienced in your dream, Noctis generates a comprehensive, poetic log of your subconscious, including deep emotional profiling, symbolic analysis, and a breathtaking AI-generated wide-screen visualization.

## Features

- **Cinematic AI Imagery**: Generates a high-quality 21:9 visual representation of your dream using Pollinations.ai.
- **Deep Subconscious Analysis**: Uses Google Gemini 1.5 Flash to extract emotional intensities and decode the cryptic symbols present in your dream.
- **Sequential Storyboard**: Reconstructs your dream chronologically, mapping out the events in a timeline format.
- **Premium Interface**: Built with Tailwind CSS and Framer Motion, featuring glassmorphism, floating ambient glows, and buttery smooth animations.

## How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key

### Setup Instructions

1. **Clone the repository** (if you haven't already).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
5. **Open Noctis**:
   Open your browser and navigate to `http://localhost:3000`.

## Architecture

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Text Engine**: Google Generative AI (Gemini 1.5 Flash)
- **AI Image Engine**: Pollinations AI (Proxy routed through Next.js backend to bypass adblockers)

## Troubleshooting

- **Image Generation Failing**: If images aren't loading, ensure you aren't blocking `localhost` requests. The image fetch is securely proxied through the Next.js server to avoid CORS/AdBlocker issues.
- **Gemini Errors**: Ensure your `GEMINI_API_KEY` is valid and has sufficient quota.

---
*Exploring the intersection of consciousness and artificial intelligence.*
