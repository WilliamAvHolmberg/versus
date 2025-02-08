"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PreviewHeader } from "./Header";
import { PreviewTabs } from "./PreviewTabs";
import { ModelResult } from "@prisma/client";


export interface GenerationPreviewProps {
  selectedResult: ModelResult | null;
  onClose: () => void;
} 

export function GenerationPreview({ selectedResult, onClose }: GenerationPreviewProps) {
  return (
    <Sheet open={!!selectedResult} onOpenChange={onClose}>
      <SheetContent className="w-full p-0 overflow-hidden bg-gradient-to-b from-background to-muted/20">
        {selectedResult && (
          <div className="h-full flex flex-col">
            <PreviewHeader result={selectedResult} onClose={onClose} />
            <PreviewTabs result={selectedResult} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
} 