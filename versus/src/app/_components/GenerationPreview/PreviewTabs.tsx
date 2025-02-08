"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelResult } from "@prisma/client";

export interface PreviewTabsProps {
  result: ModelResult;
}
export function PreviewTabs({ result }: PreviewTabsProps) {
  return (
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
                  srcDoc={result.generatedHtml}
                  style={{ 
                    width: '1920px', 
                    height: '1080px',
                    transform: 'translate3d(0,0,0)',
                    backfaceVisibility: 'hidden'
                  }}
                  className="border-none shadow-2xl"
                  title={`Full preview for ${result.modelId}`}
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
                    srcDoc={result.generatedHtml}
                    className="w-full h-full border-none"
                    title={`Mobile preview for ${result.modelId}`}
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
                {result.generatedHtml}
              </pre>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 