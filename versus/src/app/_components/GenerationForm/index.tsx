"use client";

import { PromptInput } from "../PromptInput";
import { ModelSelector } from "../ModelSelector";

export interface GenerationFormProps {
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
  lastPrompt: string;
  totalTime: number | null;
  selectedModels: string[];
  onModelToggle: (modelId: string) => void;
}

export function GenerationForm({
  onGenerate,
  isGenerating,
  lastPrompt,
  totalTime,
  selectedModels,
  onModelToggle,
}: GenerationFormProps) {
  return (
    <div className="mb-16 md:mt-32">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-4">Compare AI Models Head-to-Head</h1>
      <div className="flex flex-col max-w-5xl mx-auto">
        {/* Model Selection - 2 columns */}
        <div className="lg:col-span-2 p-6 bg-muted/5">
          <div className="space-y-4">
            <ModelSelector
              selectedModels={selectedModels}
              onModelToggle={onModelToggle}
            />
          </div>
        </div>
        {/* Prompt Input - 3 columns */}
        <div className="lg:col-span-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium"></h2>
              {totalTime && !isGenerating ? (
                <span className="text-xs text-muted-foreground">
                  Last generation: {totalTime}s
                </span>
              ) : null}
            </div>
            <PromptInput
              onSubmit={onGenerate}
              isLoading={isGenerating}
              initialValue={lastPrompt}
              disabled={selectedModels.length === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 