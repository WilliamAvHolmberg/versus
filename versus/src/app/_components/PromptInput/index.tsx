"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { TypeAnimation } from 'react-type-animation';

interface PromptInputProps {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading?: boolean;
  initialValue?: string;
  disabled?: boolean;
}

const suggestions = [
  {
    title: "A simple landing page",
    prompt: "Create a beautiful and modern landing page with a hero section, features grid, testimonials, and a contact form. Use a clean and minimal design with proper spacing and typography."
  },
  {
    title: "An ecommerce site",
    prompt: "Design a beautiful ecommerce product listing page with a navigation header, product grid showing images, prices, and ratings, filters sidebar, and a shopping cart preview. Include a search bar and category navigation."
  },
  {
    title: "Apple's website",
    prompt: "Design a clone of Apple's website"
  }
];

export function PromptInput({ 
  onSubmit, 
  isLoading = false, 
  initialValue = "", 
  disabled = false 
}: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialValue);

  useEffect(() => {
    setPrompt(initialValue);
  }, [initialValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "The prompt cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(prompt);
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Generating...";
    if (disabled) return "Select Models to Generate";
    if (!prompt.trim()) return "Enter a Prompt to Generate";
    return "Generate";
  };

  const isButtonDisabled = isLoading || disabled || !prompt.trim();

  return (
    <div className="relative bg-muted/50 rounded-2xl p-4 border-2 border-border/40 shadow-sm group overflow-hidden from-background to-muted/5 shadow-pink-500/5 relative before:absolute before:inset-0  before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          {!prompt && (
            <div className="absolute inset-0 pointer-events-none text-lg text-muted-foreground/60">
              <span className="text-primary/50">Ask the models to create </span>
              <TypeAnimation
                sequence={[
                  ...suggestions.flatMap(suggestion => [
                    suggestion.title,
                    3000,
                  ])
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                cursor={true}
                className="text-primary/60"
              />
            </div>
          )}
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder=""
            className="min-h-[45px] resize-none bg-transparent border-0 focus-visible:ring-0 focus:outline-none p-0 placeholder:text-muted-foreground/60 text-lg rounded-xl"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.title}
                type="button"
                onClick={() => setPrompt(suggestion.prompt)}
                className="px-4 py-2 text-xs font-medium bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
                  rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50
                  text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary 
                  transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 transform
                  flex items-center gap-1.5"
              >
                <span>{suggestion.title}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            ))}
          </div>
          <Button 
            type="submit" 
            size="lg"
            disabled={isButtonDisabled}
            className={`
              w-full sm:w-auto
              relative group overflow-hidden
              ${isButtonDisabled ? 'opacity-50' : 'hover:opacity-90'}
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
              dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600
              text-white shadow-lg hover:shadow-xl
              transition-all duration-300 ease-out
              border-0
            `}
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300" />
            <div className="relative flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : 'animate-pulse'}`} />
              <span className="tracking-wide">{getButtonText()}</span>
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
} 