"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { Generation, ModelResult } from "@prisma/client";

export interface GenerationWithResults extends Generation {
  results: ModelResult[];
}
export type PaginatedGenerations = {
  generations: GenerationWithResults[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
};


// Fetch all public generations and user's generations
export async function getGenerations(page: number = 1, pageSize: number = 50): Promise<PaginatedGenerations> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return {
        generations: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 1
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.generation.count({
      where: {
        OR: [
          { userId },
          { isPublic: true }
        ]
      }
    });

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Fetch paginated generations
    const generations = await prisma.generation.findMany({
      where: {
        OR: [
          { userId },
          { isPublic: true }
        ]
      },
      include: {
        results: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: pageSize
    });

    return {
      generations,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    console.error('Failed to fetch generations:', error);
    throw new Error('Failed to fetch generations');
  }
}

// Fetch only the current user's recent generations
export async function getUserGenerations(limit: number = 5) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return [];
    }

    const generations = await prisma.generation.findMany({
      where: {
        userId
      },
      include: {
        results: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return generations;
  } catch (error) {
    console.error('Failed to fetch user generations:', error);
    throw new Error('Failed to fetch user generations');
  }
} 