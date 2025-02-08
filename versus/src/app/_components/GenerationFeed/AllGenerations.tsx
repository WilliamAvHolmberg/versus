"use client";

import { Card } from "@/components/ui/card";
import { GenerationsList } from "../GenerationsList";
import { GenerationWithResults } from "@/app/actions/get-generations";
import { ModelResult } from "@prisma/client";

export interface AllGenerationsProps {
  generations: GenerationWithResults[];
  isLoading: boolean;
  isLoadingMore: boolean;
  onSelect: (result: ModelResult) => void;
}

export function AllGenerations({ 
  generations, 
  isLoading, 
  isLoadingMore, 
  onSelect 
}: AllGenerationsProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-8">Recent Generations</h2>
      {isLoading ? (
        <Card className="p-4">
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            Loading recent generations...
          </div>
        </Card>
      ) : (
        <>
          <GenerationsList generations={generations} onSelect={onSelect}/>
          {isLoadingMore && (
            <div className="mt-8 text-center text-muted-foreground">
              Loading more generations...
            </div>
          )}
        </>
      )}
    </div>
  );
} 