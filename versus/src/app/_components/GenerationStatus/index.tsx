"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronRight, Loader2 } from "lucide-react";
import PreviewCard from "../PreviewCard";
import { ModelResult } from "@prisma/client";
import { timeAgo } from "@/lib/utils";
import { useMemo } from "react";

interface GenerationStatusProps {
  prompt: string;
  selectedModels: string[];
  results: ModelResult[];
  isGenerating: boolean;
  createdAt?: Date;
  onSelect: (result: ModelResult) => void;
}

export function GenerationStatus({ prompt, selectedModels, results, isGenerating, createdAt, onSelect }: GenerationStatusProps) {
  const { success, error, loadingModels } = useMemo(() => {
    let success = [];
    const error = [];
    const loadingModels = [];

    for (const result of results) {
      if (result.error === null) {
        success.push(result);
      } else {
        error.push(result);
      }
    }

    for (const modelId of selectedModels) {
      if (!success.some(r => r.modelId === modelId)) {
        loadingModels.push(modelId);
      }
    }

    success = success.sort((a, b) => a.executionTime - b.executionTime);

    return { success, error, loadingModels };
  }, [results, selectedModels]);

  if (!isGenerating && results.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">

      {/* Prompt Section */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start p-3 h-auto text-muted-foreground hover:text-foreground group border-b border-transparent data-[state=open]:border-border transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              {isGenerating ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <h3 className="text-sm font-medium">Current Generation</h3>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-primary/40" />
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {createdAt ? timeAgo(new Date(createdAt)) : 'Generated'}
                  </h3>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
              <span className="text-sm truncate font-normal opacity-70 group-hover:opacity-100 transition-opacity duration-200 pr-4 whitespace-normal break-words">
                {prompt}
              </span>
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="animate-collapsible-down">
          <div className="p-3 border-b border-border">
            <div className="pl-5">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {prompt}
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Models Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px">
        {success.map((result) => (
          <div key={result.id} className="p-4 bg-background">
            <PreviewCard
              onSelect={() => onSelect(result)}
              result={result}
              hideDetails={true}
            />
          </div>
        ))}

        {error.map((result) => (
          <div key={result.modelId} className="p-4 bg-background">
            <Card className="group overflow-hidden border-2 border-border/40 bg-gradient-to-b from-background to-muted/5 flex flex-col min-w-[350px] shadow-sm border-red-500/30 shadow-red-500/5 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/5 before:to-orange-400/5 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
              <div className="aspect-[16/9] bg-muted/30 border-b-2 border-red-500/20 overflow-hidden relative group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-sm text-red-500">Error generating preview</div>
                </div>
              </div>
              <div className="flex-1 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                  <div className="text-xs font-bold text-muted-foreground/80">
                    {result.modelId.split('/')[1]}
                  </div>
                  <div className="flex items-center gap-1.5 text-red-500">
                    <div className="w-1 h-1 rounded-full bg-red-500/40" />
                    <span>Failed</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}

        {loadingModels.map((modelId) => (
          <div key={modelId} className="p-4 bg-background">
            <Card className="group overflow-hidden border-2 border-border/40 bg-gradient-to-b from-background to-muted/5 flex flex-col min-w-[350px] shadow-sm border-indigo-500/30 shadow-indigo-500/5 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-indigo-500/5 before:to-blue-400/5 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
              <div className="aspect-[16/9] bg-muted/30 border-b-2 border-indigo-500/20 overflow-hidden relative group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500/50" />
                </div>
              </div>
              <div className="flex-1 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                  <div className="text-xs font-bold text-muted-foreground/80">
                    {modelId.split('/')[1]}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-indigo-500/40" />
                    <span className="text-indigo-500/80">Generating...</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
} 