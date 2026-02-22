import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
  stream?: boolean;
  mode?: string;
  model?: string;
}

const SYSTEM_PROMPT = `You are an expert AI coding assistant built into a browser-based code editor. You help developers with:
- Code explanations and debugging
- Best practices and architecture advice
- Writing clean, efficient, production-ready code
- Troubleshooting errors and bugs
- Code reviews and optimizations
- Security best practices

Always provide clear, practical answers. Use proper markdown code formatting with language tags when showing code examples. Be concise but thorough.`;

async function generateGroqResponse(
  messages: any[],
  stream: boolean = false,
): Promise<ReadableStream | string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured");

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        max_tokens: 2048,
        temperature: 0.7,
        stream,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  if (stream) {
    const encoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed === "data: [DONE]") continue;
              if (trimmed.startsWith("data: ")) {
                try {
                  const json = JSON.parse(trimmed.slice(6));
                  const text = json.choices?.[0]?.delta?.content || "";
                  if (text) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
                    );
                  }
                } catch { }
              }
            }
          }
        } finally {
          controller.close();
        }
      },
    });
  } else {
    const data = await response.json();
    return data.choices[0].message.content;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { message, history = [], stream: shouldStream = false } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 },
      );
    }

    const validHistory = Array.isArray(history)
      ? history.filter(
        (msg) =>
          msg &&
          typeof msg === "object" &&
          typeof msg.role === "string" &&
          typeof msg.content === "string" &&
          ["user", "assistant"].includes(msg.role),
      )
      : [];

    const recentHistory = validHistory.slice(-10);

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...recentHistory,
      { role: "user", content: message },
    ];

    if (shouldStream) {
      const stream = await generateGroqResponse(messages, true);
      return new Response(stream as ReadableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      const aiResponse = await generateGroqResponse(messages, false);
      return NextResponse.json({
        response: aiResponse,
        model: "llama-3.3-70b-versatile",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Chat API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}