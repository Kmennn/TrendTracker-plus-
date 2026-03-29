import { VertexAI } from "@google-cloud/vertexai";
import ytdl from "ytdl-core";

const model = "gemini-1.5-flash-001";

async function getGenerativeModel() {
  const { VertexAI } = await import("@google-cloud/vertexai");
  if (!process.env.PROJECT_ID || !process.env.LOCATION) {
    throw new Error("Missing PROJECT_ID or LOCATION environment variables.");
  }
  const vertex_ai = new VertexAI({
    project: process.env.PROJECT_ID,
    location: process.env.LOCATION,
  });
  return vertex_ai.getGenerativeModel({
    model: model,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 1,
      topP: 0.95,
    },
  });
}

async function getAudioBuffer(url) {
  const audioStream = ytdl(url, { filter: "audioonly" });
  const chunks = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function summarizeVideo(videoUrl, prompt) {
  try {
    if (!ytdl.validateURL(videoUrl)) {
      throw new Error("Invalid YouTube URL");
    }

    const audioBuffer = await getAudioBuffer(videoUrl);
    const audio_file = {
      inlineData: {
        data: audioBuffer.toString("base64"),
        mimeType: "audio/mp4",
      },
    };

    const request = {
      contents: [{ role: "user", parts: [audio_file, { text: prompt }] }],
    };

    const generativeModel = await getGenerativeModel();
    const result = await generativeModel.generateContent(request);
    return result.response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error summarizing video:", error);
    throw new Error(
      "Failed to summarize video. Please check the URL and try again.",
    );
  }
}

export default summarizeVideo;
