// server.js (Stability API 버전)
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 🔐 Stability API 키를 사용합니다. (예: STABILITY_API_KEY=sk-xxx node server.js)
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

// Stability 스타일 매핑 (UI 값 -> API preset)
const stylePresetMap = {
  realistic: "photographic",
  anime: "anime",
  "digital-art": "digital-art",
  fantasy: "fantasy-art",
  cyberpunk: "neon-punk",
};

// 🔥 이미지 생성 API Proxy (Stability)
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, style } = req.body;

    if (!STABILITY_API_KEY) {
      return res
        .status(500)
        .json({ error: "Server missing STABILITY_API_KEY. Set it and restart the server." });
    }

    const stylePreset = stylePresetMap[style] || undefined;

    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          steps: 30,
          width: 1024,
          height: 1024,
          style_preset: stylePreset,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.message ||
        data?.errors?.[0] ||
        data?.error ||
        "Upstream API error";
      return res.status(response.status).json({ error: message });
    }

    const base64 = data?.artifacts?.[0]?.base64;

    if (!base64) {
      return res.status(500).json({ error: "No image returned from Stability." });
    }

    // Return a data URL so the frontend can display it directly
    res.json({ image: `data:image/png;base64,${base64}` });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Failed to connect to Stability API" });
  }
});

// 서버 실행
app.listen(3000, () =>
  console.log("🚀 Proxy API server running at http://localhost:3000")
);
