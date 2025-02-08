import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const { generationId, modelId, prompt } = await request.json();

  if (!generationId || !modelId || !prompt) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
  });

  try {
    const result = await streamText({
      model: openrouter(modelId),
      prompt: `
You are an HTML generator. Your task is to: ${prompt}

Requirements:
- Use Tailwind CSS for styling
- Include the Tailwind CDN in the head
- Make sure the design is clean and professional
- You are an design expert, the best designer in the world, create an amazing UI/UX, use colors that are not just "normal"
-Use unsplash images to make the design more beautiful if applicable

I only want you to output the actual code
Code output should be in format:
SUPER IMPORTANT TO FOLLOW THIS FORMAT:
<code>codehere</code>`,
    });

    let fullOutput = "";
    for await (const chunk of result.textStream) {
      fullOutput += chunk;
    }

    // Extract HTML between <code> tags
    const codeMatch = fullOutput.match(/<code>([\s\S]*?)<\/code>/);
    const htmlContent = codeMatch ? codeMatch[1].trim() : fullOutput;

    const executionTime = Date.now() - startTime;

    // Store the result
    const modelResult = await prisma.modelResult.create({
      data: {
        prompt,
        generationId,
        modelId,
        generatedHtml: htmlContent,
        executionTime,
        cost: 0.0001, // TODO: Calculate actual cost based on OpenRouter's response
      },
    });

    return Response.json(modelResult);
  } catch (error) {
    // Store the error
    const modelResult = await prisma.modelResult.create({
      data: {
        prompt,
        generationId,
        modelId,
        generatedHtml: "",
        executionTime: Date.now() - startTime,
        cost: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return Response.json(modelResult);
  }
} 