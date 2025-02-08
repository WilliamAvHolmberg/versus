"use client";

import { ModelResult } from "@prisma/client";
import { GenerationStatus } from "../GenerationStatus";
import { GenerationWithResults } from "@/app/actions/get-generations";

export interface UserGenerationsProps {
  generations: GenerationWithResults[];
  onSelect: (result: ModelResult) => void;
}


export function UserGenerations({ generations, onSelect }: UserGenerationsProps) {
  if (generations.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-medium tracking-tight">Your Recent Generations</h2>
      </div>
      {generations.map((generation) => (
        <GenerationStatus
          key={generation.id}
          prompt={generation.prompt}
          selectedModels={generation.results.map(r => r.modelId)}
          results={generation.results}
          isGenerating={false}
          createdAt={generation.createdAt}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
} 