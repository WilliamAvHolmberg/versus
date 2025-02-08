"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Types
export type GenerateRequest = {
  prompt: string;
  models: string[];
};

// Get or create anonymous user ID
const getOrCreateUserId = async () => {
  const cookieStore = await cookies();
  let userId = cookieStore.get("userId")?.value;

  if (!userId) {
    userId = uuidv4();
    // This will be handled by the client to set the cookie
    return userId;
  }

  return userId;
};

export async function initGeneration({ prompt, models }: GenerateRequest) {
  const userId = await getOrCreateUserId();

  // Create the generation record
  const generation = await prisma.generation.create({
    data: {
      prompt,
      userId,
      isPublic: true, // Default to public for MVP
    },
  });

  return {
    generationId: generation.id,
    models,
  };
} 