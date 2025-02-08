"use client";

import { useState } from "react";
import { submitFeedback } from "@/app/actions/submit-feedback";
import { toast } from "@/hooks/use-toast";

type FeedbackFormProps = {
  onClose: () => void;
};

export function FeedbackForm({ onClose }: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const type = formData.get("type") as "BUG" | "FEATURE_REQUEST" | "GENERAL" | "OTHER";
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const email = formData.get("email") as string;

    try {
      const result = await submitFeedback({
        type,
        title,
        description,
        email: email || undefined,
      });

      if (result.success) {
        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback!",
        });
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Share Your Feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Type
            </label>
            <select
              id="type"
              name="type"
              className="w-full p-2 border rounded-md bg-background"
              required
            >
              <option value="BUG">Bug Report</option>
              <option value="FEATURE_REQUEST">Feature Request</option>
              <option value="GENERAL">General Feedback</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-md hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 