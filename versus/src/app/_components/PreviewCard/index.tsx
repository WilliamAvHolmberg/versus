import { Card } from "@/components/ui/card";
import { timeAgo } from "@/lib/utils";
import { ModelResult } from "@prisma/client";
import { useInView } from '@react-spring/web'

interface PreviewCardProps {
    onSelect: (result: ModelResult) => void;
    result: ModelResult;
    hideDetails?: boolean;
}

export default function PreviewCard({ onSelect, result, hideDetails = false }: PreviewCardProps) {
    const [ref, inView] = useInView()
    return <Card
        key={result.id}
        className="group overflow-hidden border-2 border-border/40 bg-gradient-to-b from-background to-muted/5 flex flex-col cursor-pointer transition-all duration-200 border-purple-500/30 hover:shadow-md hover:scale-[1.02] min-w-[350px] shadow-sm shadow-pink-500/5 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/5 before:to-pink-400/5 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100"
        onClick={() => onSelect(result)}
        ref={ref}
    >
        {/* Preview Area */}
        <div className="aspect-[16/9] bg-muted/30 border-b-2 border-purple-500/20 overflow-hidden relative group">
            <div className="relative overflow-hidden bg-white dark:bg-black h-full">
                {inView ? <div className="absolute inset-0 scale-[0.2] origin-top-left w-[500%] h-[500%]">
                    <iframe
                        srcDoc={result.generatedHtml}
                        className="w-full h-full pointer-events-none"
                        style={{ transform: 'scale(1)', width: '1920px', height: '1080px' }}
                        title={`Preview for ${result.modelId}`}
                    />
                </div> : null}
            </div>
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-background/95 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm border border-border/50">
                    View Details
                </div>
            </div>
        </div>
        {hideDetails ? <div className="flex-1 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                <div className="text-xs font-bold text-muted-foreground/80">
                    {result.modelId.split('/')[1]}
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                    <span>{result.executionTime}ms</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                    <span>${result.cost?.toFixed(4) ?? 'UNKOWN'}</span>
                </div>
            </div>
        </div> : null}

        {/* Result Info */}
        {!hideDetails ? <div className="flex-1 p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-primary/50"
                        >
                            <path
                                d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31167C10.7244 8.55135 9.70025 8.12901 8.50625 7.98352C10.0187 7.54739 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <span className="text-sm text-muted-foreground">{timeAgo(result.createdAt)}</span>
                </div>
                <div className="text-xs font-medium text-muted-foreground/80">
                    {result.modelId.split('/')[1]}
                </div>
            </div>

            <p className="text-sm line-clamp-2 text-muted-foreground">{result.prompt}</p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                    <span>{result.executionTime}ms</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                    <span>${result.cost?.toFixed(4) ?? 'UNKOWN'}</span>
                </div>
            </div>
        </div> : null}
    </Card>
}