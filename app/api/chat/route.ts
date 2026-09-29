import { NextResponse } from "next/server";
import { retrieveKnowledge } from "../lib/knowledge-base";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is missing" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const message = body?.message;
    const image = body?.image;

    if (!message && !image) {
      return NextResponse.json(
        { error: "Please provide a message or image." },
        { status: 400 }
      );
    }

    // RAG: retrieve relevant knowledge
    const retrievedChunks = message
      ? retrieveKnowledge(message, 3)
      : [];

    const retrievedContext =
      retrievedChunks.length > 0
        ? retrievedChunks
            .map(
              (chunk, index) =>
                `[Knowledge ${index + 1}] ${chunk.title}\n${chunk.content}`
            )
            .join("\n\n")
        : "No directly relevant knowledge-base information was found.";

    // Build multimodal user content
    const userContent: Array<
      | {
          type: "text";
          text: string;
        }
      | {
          type: "image_url";
          image_url: {
            url: string;
          };
        }
    > = [];

    if (message) {
      userContent.push({
        type: "text",
        text: `Student question:

${message}

Relevant EduMind knowledge retrieved for this question:

${retrievedContext}

Use the retrieved knowledge when it is relevant. Explain the answer naturally and clearly.`,
      });
    } else {
      userContent.push({
        type: "text",
        text: `Analyze the uploaded image and explain what it contains in simple language.

There is no text question from the student. Focus on understanding the image.`,
      });
    }

    if (image) {
      userContent.push({
        type: "image_url",
        image_url: {
          url: image,
        },
      });
    }

    // Send request to Groq
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "qwen/qwen3.8-27b",

          messages: [
            {
              role: "system",
              content: `You are EduMind AI, a friendly educational assistant.

Your job is to help students understand concepts clearly.

You can work with both text and images.

When relevant knowledge is provided in the prompt, use it as additional context for your answer.

If an image is provided, carefully analyze it. It may contain text, equations, diagrams, charts, screenshots, or study material.

Do not invent information that cannot be supported by the question, image, or retrieved context.

Use simple, student-friendly language.

For educational questions, structure the answer clearly when useful.`,
            },
            {
              role: "user",
              content: userContent,
            },
          ],

          temperature: 0.7,
          max_completion_tokens: 800,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error?.message || "AI request failed",
        },
        { status: response.status }
      );
    }

    const answer = data.choices?.[0]?.message?.content;

    return NextResponse.json({
      answer: answer || "I couldn't generate a response.",
      sources: retrievedChunks.map((chunk) => chunk.title),
    });
  } catch (error) {
    console.error("EduMind AI error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while contacting EduMind AI.",
      },
      { status: 500 }
    );
  }
}