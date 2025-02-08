"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  html: string;
  prompt?: string;
  metadata?: {
    executionTime?: number;
    cost?: number;
    createdAt?: Date;
  };
  onCopyHtml?: () => void;
}

export function PreviewSheet({ 
  open, 
  onOpenChange, 
  title, 
  subtitle,
  html,
  prompt,
  metadata,
  onCopyHtml 
}: PreviewSheetProps) {
  const handleCopyHtml = async () => {
    if (onCopyHtml) {
      onCopyHtml();
    } else {
      try {
        await navigator.clipboard.writeText(html);
        toast({
          title: "Copied!",
          description: "HTML copied to clipboard",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to copy HTML",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full p-0 overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <div className="h-full flex flex-col">
          {/* Enhanced Crystalline Header */}
          <div className="flex-none border-b backdrop-blur-xl bg-background/60 supports-[backdrop-filter]:bg-background/20">
            <div className="px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h4 className="text-base font-medium tracking-tight">
                  {title}
                  {subtitle && (
                    <span className="ml-2 text-xs text-muted-foreground/60 font-normal">
                      {subtitle}
                    </span>
                  )}
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyHtml}
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
            {prompt && (
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
                          {prompt}
                        </span>
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="transition-all duration-300">
                    <Card className="mt-3 p-4 bg-muted/30 border-muted/50 backdrop-blur-sm">
                      <p className="text-sm leading-relaxed">{prompt}</p>
                      {metadata && (
                        <div className="mt-4 pt-3 border-t border-muted/20 flex items-center justify-between text-xs text-muted-foreground/60">
                          <div className="flex items-center gap-4">
                            {metadata.executionTime && <span>{metadata.executionTime}ms</span>}
                            {metadata.cost && <span>${metadata.cost?.toFixed(4)}</span>}
                          </div>
                          {metadata.createdAt && (
                            <time dateTime={`${metadata.createdAt}`}>
                              {new Date(metadata.createdAt)?.toLocaleString()}
                            </time>
                          )}
                        </div>
                      )}
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </div>

          {/* Enhanced Preview Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="preview" className="h-full flex flex-col">
              <div className="flex-none h-12 px-8 flex items-center border-b bg-muted/20 backdrop-blur-sm">
                <TabsList className="w-auto bg-transparent gap-6 p-0 h-full">
                  <TabsTrigger 
                    value="preview" 
                    className="group px-3 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 rounded-none text-sm font-medium transition-all duration-300"
                  >
                    <span className="opacity-70 group-hover:opacity-100 transition-opacity duration-300">Preview</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="mobile" 
                    className="px-3 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 rounded-none text-sm font-medium transition-colors duration-200"
                  >
                    Mobile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="code" 
                    className="px-3 h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 rounded-none text-sm font-medium transition-colors duration-200"
                  >
                    Code
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="preview" className="flex-1 mt-0 relative bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-950">
                <div className="absolute inset-0 p-8 overflow-hidden">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="scale-[0.6] origin-center transition-transform duration-500">
                      <iframe
                        srcDoc={html}
                        style={{ 
                          width: '1920px', 
                          height: '1080px',
                          transform: 'translate3d(0,0,0)',
                          backfaceVisibility: 'hidden'
                        }}
                        className="border-none shadow-2xl"
                        title={`Full preview for ${title}`}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mobile" className="flex-1 mt-0">
                <div className="h-full flex items-center justify-center bg-gradient-to-b from-muted/30 to-muted/10">
                  <div className="relative w-[375px] h-[812px] bg-background border rounded-[3rem] shadow-2xl overflow-hidden">
                    <div className="absolute inset-0">
                      {/* iPhone-style Notch */}
                      <div className="absolute top-0 inset-x-0 h-6 bg-black z-10">
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full" />
                      </div>
                      <div className="absolute inset-[1px] rounded-[calc(3rem-1px)] overflow-hidden">
                        <iframe
                          srcDoc={html}
                          className="w-full h-full border-none"
                          title={`Mobile preview for ${title}`}
                        />
                      </div>
                    </div>
                    <div className="absolute inset-[1px] pointer-events-none rounded-[calc(3rem-1px)] border border-muted/20" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="code" className="flex-1 mt-0">
                <div className="h-full bg-gradient-to-b from-muted/20 to-muted/10 p-8">
                  <Card className="h-full bg-muted/50 overflow-hidden border-muted/50">
                    <pre className="p-6 text-sm overflow-auto h-full font-mono">
                      {html}
                    </pre>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 