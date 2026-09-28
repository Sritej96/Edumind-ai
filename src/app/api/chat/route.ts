import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

 const result = streamText({
  model: groq("qwen/qwen3.8-27b"),
  system:
    "You are EduMind AI, a helpful educational assistant. Explain concepts clearly and simply, and provide accurate answers.",
  messages: await convertToModelMessages(messages),
});

  return result.toUIMessageStreamResponse();
}