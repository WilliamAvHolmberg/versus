"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { FeedbackType } from "@prisma/client";

type SubmitFeedbackRequest = {
  type: FeedbackType;
  title: string;
  description: string;
  email?: string;
};

export async function submitFeedback({ type, title, description, email }: SubmitFeedbackRequest) {
  try {
    // Get userId from cookie if exists
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        type,
        title,
        description,
        email,
        userId,
        status: false, // Default to unread/unhandled
      },
    });

    return {
      success: true,
      feedbackId: feedback.id,
    };
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit feedback",
    };
  }
} 