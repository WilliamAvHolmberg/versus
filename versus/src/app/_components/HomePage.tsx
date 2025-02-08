"use client";

import { useState, useEffect } from "react";
import { initGeneration } from "../actions/generate";
import { GenerationWithResults, getGenerations, getUserGenerations, PaginatedGenerations } from "../actions/get-generations";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { setCookie } from "cookies-next";
import { HeroSection } from "./HeroSection";
import { GenerationForm } from "./GenerationForm";
import { GenerationFeed } from "./GenerationFeed";
import { GenerationPreview } from "./GenerationPreview";
import { GenerationStatus } from "./GenerationStatus";
import { FeedbackButton } from "./FeedbackButton";
import { ModelResult } from "@prisma/client";
import { ToastProvider } from "@/components/ui/toast";

export interface HomePageProps {
  initialUserId?: string;
}

export function HomePage({ initialUserId }: HomePageProps) {

  const [selectedModels, setSelectedModels] = useState<string[]>([
    "anthropic/claude-3.5-sonnet",
    "google/gemini-2.0-flash-001",
    "deepseek/deepseek-chat"
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationWithResults[]>([]);
  const [isLoadingGenerations, setIsLoadingGenerations] = useState(true);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<number | null>(null);
  const [currentGeneration, setCurrentGeneration] = useState<{
    prompt: string;
    selectedModels: string[];
    results: ModelResult[];
  } | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [userGenerations, setUserGenerations] = useState<GenerationWithResults[]>([]);
  const [selectedResult, setSelectedResult] = useState<ModelResult | null>(null);

  // Handle user ID on client side
  useEffect(() => {
    if (!initialUserId) {
      const newUserId = uuidv4();
      setCookie("userId", newUserId, { maxAge: 60 * 60 * 24 * 365 }); // 1 year
    }
  }, [initialUserId]);

  // Fetch both user generations and all generations
  useEffect(() => {
    async function fetchGenerations() {
      try {
        setIsLoadingGenerations(true);

        // Fetch user's recent generations
        const userGens = await getUserGenerations();
        setUserGenerations(userGens);

        // Fetch all generations
        const data = await getGenerations(1) as PaginatedGenerations;
        setGenerations(data.generations);
        setHasMore(data.currentPage < data.totalPages);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load generations",
          variant: "destructive",
        });
      } finally {
        setIsLoadingGenerations(false);
      }
    }

    fetchGenerations();
  }, []);

  // Load more generations
  const loadMoreGenerations = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getGenerations(nextPage) as PaginatedGenerations;

      setGenerations(prev => [...prev, ...data.generations]);
      setPage(nextPage);
      setHasMore(data.currentPage < data.totalPages);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load more generations",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle scroll for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
        loadMoreGenerations();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isLoadingMore, hasMore]);

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleGenerate = async (prompt: string) => {
    setLastPrompt(prompt);

    if (selectedModels.length === 0) {
      toast({
        title: "No models selected",
        description: "Please select at least one model to generate content",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationStartTime(Date.now());
    setTotalTime(null);

    try {
      // Fetch fresh data before starting new generation
      const [userGens] = await Promise.all([
        getUserGenerations()
      ]);

      setUserGenerations(userGens);

      // Initialize generation and get ID
      const { generationId } = await initGeneration({ prompt, models: selectedModels });

      const tempGeneration = {
        prompt,
        selectedModels,
        results: []
      }
      setCurrentGeneration(tempGeneration);

      // Start parallel generation for each model using fetch
      const modelPromises = selectedModels.map(modelId =>
        fetch('/api/generate/model', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            generationId,
            modelId,
            prompt
          })
        })
          .then(res => res.json())
          .then(result => {
            // Update current generation results as they come in
            setCurrentGeneration(prev => {
              if (!prev) return { ...tempGeneration, results: [result] };
              return {
                ...prev,
                results: [...prev.results, result]
              };
            });
            return result;
          })
          .catch(error => {
            console.error(`Error generating for model ${modelId}:`, error);
            toast({
              title: "Error",
              description: `Failed to generate content for model ${modelId}. Please try again.`,
              variant: "destructive",
            });
            return {
              modelId,
              success: false,
              error: error instanceof Error ? error.message : "Unknown error"
            };
          })
      );

      // Wait for all generations to complete
      await Promise.all(modelPromises);

      const endTime = Date.now();
      const totalSeconds = ((endTime - (generationStartTime || endTime)) / 1000)?.toFixed(1);
      setTotalTime(parseFloat(totalSeconds));

      toast({
        title: "Generation Complete",
        description: `Generated in ${totalSeconds}s`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <ToastProvider>
        <HeroSection />

        <GenerationForm
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          lastPrompt={lastPrompt}
          totalTime={totalTime}
          selectedModels={selectedModels}
          onModelToggle={handleModelToggle}
        />

        {/* Current Generation Status */}
        {(isGenerating || currentGeneration) && (
          <GenerationStatus
            prompt={currentGeneration?.prompt || ""}
            selectedModels={currentGeneration?.selectedModels || []}
            results={currentGeneration?.results || []}
            isGenerating={isGenerating}
            onSelect={setSelectedResult}
          />
        )}

        <GenerationFeed
          userGenerations={userGenerations}
          allGenerations={generations}
          isLoading={isLoadingGenerations}
          isLoadingMore={isLoadingMore}
          onSelect={setSelectedResult}
        />

        <GenerationPreview
          selectedResult={selectedResult}
          onClose={() => setSelectedResult(null)}
        />

        <FeedbackButton />
      </ToastProvider>
    </main>
  );
} 