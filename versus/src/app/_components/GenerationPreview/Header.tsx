"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { handleCopyHtml, timeAgo } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { ModelResult } from "@prisma/client";
export interface PreviewHeaderProps {
  result: ModelResult;
  onClose: () => void;
}


export function PreviewHeader({ result }: PreviewHeaderProps) {
  return (
    <div className="flex-none border-b backdrop-blur-xl bg-background/60 supports-[backdrop-filter]:bg-background/20">
      <div className="px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h4 className="text-base font-medium tracking-tight">
            {result.modelId}
            <span className="ml-2 text-xs text-muted-foreground/60 font-normal">
              {timeAgo(new Date(result.createdAt))}
            </span>
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopyHtml(result.generatedHtml)}
            className="h-8 px-3 text-xs gap-2 transition-all duration-200 hover:bg-primary/10"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-70"
            >
              <path
                d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67157 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67157 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
            Copy HTML
          </Button>
        </div>
      </div>

      {/* Refined Prompt Display */}
      <div className="px-8 pb-4">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start p-0 h-8 text-muted-foreground hover:text-foreground group bg-muted/10 hover:bg-muted/20 rounded-lg transition-all duration-300"
            >
              <div className="flex items-center gap-2 px-3">
                <ChevronRight className="h-3 w-3 transition-transform duration-300 group-data-[state=open]:rotate-90" />
                <span className="truncate font-normal opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  {result.prompt}
                </span>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="transition-all duration-300">
            <Card className="mt-3 p-4 bg-muted/30 border-muted/50 backdrop-blur-sm">
              <p className="text-sm leading-relaxed">{result.prompt}</p>
              <div className="mt-4 pt-3 border-t border-muted/20 flex items-center justify-between text-xs text-muted-foreground/60">
                <div className="flex items-center gap-4">
                  <span>{result.executionTime}ms</span>
                  <span>${result.cost?.toFixed(4)}</span>
                </div>
                <time dateTime={`${result.createdAt}`}>
                  {result.createdAt?.toLocaleString()}
                </time>
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
} 