"use client";

import { Card } from "@/components/ui/card";
import PreviewCard from "../PreviewCard";
import { GenerationWithResults } from "@/app/actions/get-generations";
import { ModelResult } from "@prisma/client";

interface GenerationsListProps {
  generations: GenerationWithResults[];
  onSelect: (result: ModelResult) => void;
}

export function GenerationsList({ generations, onSelect }: GenerationsListProps) {
  // Flatten generations and their results
  const flattenedResults = generations.flatMap(generation =>
    generation.results.map(result => ({
      ...result,
      prompt: generation.prompt,
      generationId: generation.id,
      createdAt: generation.createdAt
    }))
  );


  return (
    <>
      <div className="space-y-8">
        {generations.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-sm mx-auto space-y-3">
              <p className="text-lg font-medium text-muted-foreground">No generations yet</p>
              <p className="text-sm text-muted-foreground/60">Start by entering a prompt and selecting models to see your generations appear here.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-medium tracking-tight">Recent Results</h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {flattenedResults.map((result) => (
                  <PreviewCard key={result.id} onSelect={() => onSelect(result)} result={result} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 