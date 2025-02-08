import { toast } from "@/hooks/use-toast";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const handleCopyHtml = async (html: string) => {
  try {
    await navigator.clipboard.writeText(html);
    toast({
      title: "Copied!",
      description: "HTML copied to clipboard",
    });
  } catch {
    toast({
      title: "Error",
      description: "Failed to copy HTML",
      variant: "destructive",
    });
  }
};

export function timeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  } else {
    return new Date(date).toLocaleDateString();
  }
}

export function formatModelPrice(promptPrice: number, completionPrice: number): {input: string, output: string} {
  // 1 word ≈ 1.33 tokens (0.75 words per token)
  const tokensPerWord = 1.33;
  
  // Calculate prices for 1000 words
  const inputPrice = promptPrice * tokensPerWord * 1000;
  const outputPrice = completionPrice * tokensPerWord * 1000;
  
  // Format the prices to a reasonable number of decimal places
  const formatPrice = (price: number) => 
    price < 0.01 ? price.toFixed(4) : price.toFixed(2);

  return {
    input: `~$${formatPrice(inputPrice)} per 1000 words input (ish)`,
    output: `~$${formatPrice(outputPrice)} per 1000 words output (ish)`
  };
}