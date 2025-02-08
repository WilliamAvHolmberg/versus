"use client";

import { UserGenerations } from "./UserGenerations";
import { AllGenerations } from "./AllGenerations";
import { ModelResult } from "@prisma/client";
import { GenerationWithResults } from "@/app/actions/get-generations";

export interface GenerationFeedProps {
  userGenerations: GenerationWithResults[];
  allGenerations: GenerationWithResults[];
  isLoading: boolean;
  isLoadingMore: boolean;
  onSelect: (result: ModelResult) => void;
} 

export function GenerationFeed({
  userGenerations,
  allGenerations,
  isLoading,
  isLoadingMore,
  onSelect
}: GenerationFeedProps) {
  return (
    <>
      <UserGenerations generations={userGenerations} onSelect={onSelect} />
      <AllGenerations
        generations={allGenerations}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        onSelect={onSelect}
      />
    </>
  );
} 