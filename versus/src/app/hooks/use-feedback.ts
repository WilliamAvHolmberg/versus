"use client";

import { useSearchParams, useRouter } from "next/navigation";

export function useFeedback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOpen = searchParams.get("feedback") === "true";

  const openFeedback = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("feedback", "true");
    router.push(`?${params.toString()}`);
  };

  const closeFeedback = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("feedback");
    router.push(`?${params.toString()}`);
  };

  return {
    isOpen,
    openFeedback,
    closeFeedback,
  };
} 