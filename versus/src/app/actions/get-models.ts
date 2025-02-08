"use server";

import { cache } from "react";
import { z } from "zod";

// Validation schema for API response
const ModelPricingSchema = z.object({
  prompt: z.string(),
  completion: z.string(),
});

const ModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  pricing: ModelPricingSchema,
});

const ModelsResponseSchema = z.object({
  data: z.array(ModelSchema),
});

export type OpenRouterModel = z.infer<typeof ModelSchema>;

// Cache the getModels function for 1 hour
export const getModels = cache(async () => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.VERCEL_URL || "http://localhost:3000", // Required for OpenRouter API
      },
      next: {
        revalidate: 3600 // Cache for 1 hour
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const rawData = await response.json();
    
    // Validate the response data
    const parsedData = ModelsResponseSchema.safeParse(rawData);
    
    if (!parsedData.success) {
      console.error("API response validation failed:", parsedData.error);
      throw new Error("Invalid API response format");
    }

    return parsedData.data.data;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw new Error("Failed to fetch models");
  }
}); 