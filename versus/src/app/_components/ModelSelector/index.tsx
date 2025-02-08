"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatModelPrice } from "@/lib/utils";
import { Settings2 } from "lucide-react";

import type { OpenRouterModel } from "@/app/actions/get-models";

interface ModelSelectorProps {
  selectedModels: string[];
  onModelToggle: (modelId: string) => void;
}

export function ModelSelector({ selectedModels, onModelToggle }: ModelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [models] = useState<OpenRouterModel[]>([
    {
      "id": "anthropic/claude-3.5-sonnet",
      "name": "Anthropic: Claude 3.5 Sonnet",
      "description": "New Claude 3.5 Sonnet delivers better-than-Opus capabilities, faster-than-Sonnet speeds, at the same Sonnet prices. Sonnet is particularly good at:\n\n- Coding: Scores ~49% on SWE-Bench Verified, higher than the last best score, and without any fancy prompt scaffolding\n- Data science: Augments human data science expertise; navigates unstructured data while using multiple tools for insights\n- Visual processing: excelling at interpreting charts, graphs, and images, accurately transcribing text to derive insights beyond just the text alone\n- Agentic tasks: exceptional tool use, making it great at agentic tasks (i.e. complex, multi-step problem solving tasks that require engaging with other systems)\n\n#multimodal",
      "pricing": {
        "prompt": "0.000008",
        "completion": "0.000015"
      }
    },
    {
      "id": "google/gemini-2.0-flash-001",
      "name": "Google: Gemini Flash 2.0",
      "description": "Gemini Flash 2.0 offers a significantly faster time to first token (TTFT) compared to [Gemini Flash 1.5](/google/gemini-flash-1.5), while maintaining quality on par with larger models like [Gemini Pro 1.5](/google/gemini-pro-1.5). It introduces notable enhancements in multimodal understanding, coding capabilities, complex instruction following, and function calling. These advancements come together to deliver more seamless and robust agentic experiences.",
      "pricing": {
        "prompt": "0.0000001",
        "completion": "0.0000004"
      }
    },
    {
      "id": "x-ai/grok-2-1212",
      "name": "xAI: Grok 2 1212",
      "description": "Grok 2 1212 introduces significant enhancements to accuracy, instruction adherence, and multilingual support, making it a powerful and flexible choice for developers seeking a highly steerable, intelligent model.",
      "pricing": {
        "prompt": "0.000002",
        "completion": "0.00001"
      }
    },
    {
      "id": "qwen/qwen-2.5-coder-32b-instruct",
      "name": "Qwen2.5 Coder 32B Instruct",
      "description": "Qwen2.5-Coder is the latest series of Code-Specific Qwen large language models (formerly known as CodeQwen). Qwen2.5-Coder brings the following improvements upon CodeQwen1.5:\n\n- Significantly improvements in **code generation**, **code reasoning** and **code fixing**. \n- A more comprehensive foundation for real-world applications such as **Code Agents**. Not only enhancing coding capabilities but also maintaining its strengths in mathematics and general competencies.\n\nTo read more about its evaluation results, check out [Qwen 2.5 Coder's blog](https://qwenlm.github.io/blog/qwen2.5-coder-family/).",
      "pricing": {
        "prompt": "0.00000007",
        "completion": "0.00000016"
      }
    },
    {
      "id": "openai/gpt-4o-mini",
      "name": "OpenAI: GPT-4o-mini",
      "description": "GPT-4o mini is OpenAI's newest model after [GPT-4 Omni](/models/openai/gpt-4o), supporting both text and image inputs with text outputs.\n\nAs their most advanced small model, it is many multiples more affordable than other recent frontier models, and more than 60% cheaper than [GPT-3.5 Turbo](/models/openai/gpt-3.5-turbo). It maintains SOTA intelligence, while being significantly more cost-effective.\n\nGPT-4o mini achieves an 82% score on MMLU and presently ranks higher than GPT-4 on chat preferences [common leaderboards](https://arena.lmsys.org/).\n\nCheck out the [launch announcement](https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/) to learn more.\n\n#multimodal",
      "pricing": {
        "prompt": "0.00000015",
        "completion": "0.0000006"
      }
    },
    {
      "id": "qwen/qwen-plus",
      "name": "Qwen: Qwen-Plus",
      "description": "Qwen-Plus, based on the Qwen2.5 foundation model, is a 131K context model with a balanced performance, speed, and cost combination.",
      "pricing": {
        "prompt": "0.0000004",
        "completion": "0.0000012"
      }
    },
    {
      "id": "qwen/qwen-max",
      "name": "Qwen: Qwen-Max ",
      "description": "Qwen-Max, based on Qwen2.5, provides the best inference performance among [Qwen models](/qwen), especially for complex multi-step tasks. It's a large-scale MoE model that has been pretrained on over 20 trillion tokens and further post-trained with curated Supervised Fine-Tuning (SFT) and Reinforcement Learning from Human Feedback (RLHF) methodologies. The parameter count is unknown.",
      "pricing": {
        "prompt": "0.0000016",
        "completion": "0.0000064"
      }
    },
    {
      "id": "google/gemini-2.0-pro-exp-02-05:free",
      "name": "Google: Gemini Pro 2.0 Experimental (free)",
      "description": "Gemini 2.0 Pro Experimental is a bleeding-edge version of the Gemini 2.0 Pro model. Because it's currently experimental, it will be **heavily rate-limited** by Google.\n\nUsage of Gemini is subject to Google's [Gemini Terms of Use](https://ai.google.dev/terms).\n\n#multimodal",
      "pricing": {
        "prompt": "0",
        "completion": "0"
      }
    },
    {
      "id": "anthropic/claude-3.5-haiku-20241022",
      "name": "Anthropic: Claude 3.5 Haiku (2024-10-22)",
      "description": "Claude 3.5 Haiku features enhancements across all skill sets including coding, tool use, and reasoning. As the fastest model in the Anthropic lineup, it offers rapid response times suitable for applications that require high interactivity and low latency, such as user-facing chatbots and on-the-fly code completions. It also excels in specialized tasks like data extraction and real-time content moderation, making it a versatile tool for a broad range of industries.\n\nIt does not support image inputs.\n\nSee the launch announcement and benchmark results [here](https://www.anthropic.com/news/3-5-models-and-computer-use)",
      "pricing": {
        "prompt": "0.0000008",
        "completion": "0.000004"
      }
    },
    {
      "id": "google/gemini-flash-1.5",
      "name": "Google: Gemini Flash 1.5",
      "description": "Gemini 1.5 Flash is a foundation model that performs well at a variety of multimodal tasks such as visual understanding, classification, summarization, and creating content from image, audio and video. It's adept at processing visual and text inputs such as photographs, documents, infographics, and screenshots.\n\nGemini 1.5 Flash is designed for high-volume, high-frequency tasks where cost and latency matter. On most common tasks, Flash achieves comparable quality to other Gemini Pro models at a significantly reduced cost. Flash is well-suited for applications like chat assistants and on-demand content generation where speed and scale matter.\n\nUsage of Gemini is subject to Google's [Gemini Terms of Use](https://ai.google.dev/terms).\n\n#multimodal",
      "pricing": {
        "prompt": "0.000000075",
        "completion": "0.0000003"
      }
    },
    {
      "id": "deepseek/deepseek-r1-distill-llama-70b",
      "name": "DeepSeek: R1 Distill Llama 70B",
      "description": "DeepSeek R1 Distill Llama 70B is a distilled large language model based on [Llama-3.3-70B-Instruct](/meta-llama/llama-3.3-70b-instruct), using outputs from [DeepSeek R1](/deepseek/deepseek-r1). The model combines advanced distillation techniques to achieve high performance across multiple benchmarks, including:\n\n- AIME 2024 pass@1: 70.0\n- MATH-500 pass@1: 94.5\n- CodeForces Rating: 1633\n\nThe model leverages fine-tuning from DeepSeek R1's outputs, enabling competitive performance comparable to larger frontier models.",
      "pricing": {
        "prompt": "0.00000023",
        "completion": "0.00000069"
      }
    },
    {
      "id": "deepseek/deepseek-chat",
      "name": "DeepSeek: DeepSeek V3",
      "description": "DeepSeek-V3 is the latest model from the DeepSeek team, building upon the instruction following and coding abilities of the previous versions. Pre-trained on nearly 15 trillion tokens, the reported evaluations reveal that the model outperforms other open-source models and rivals leading closed-source models.\n\nFor model details, please visit [the DeepSeek-V3 repo](https://github.com/deepseek-ai/DeepSeek-V3) for more information, or see the [launch announcement](https://api-docs.deepseek.com/news/news1226).",
      "pricing": {
        "prompt": "0.00000049",
        "completion": "0.00000089"
      }
    },
    {
      "id": "deepseek/deepseek-r1",
      "name": "DeepSeek: R1",
      "description": "DeepSeek R1 is here: Performance on par with [OpenAI o1](/openai/o1), but open-sourced and with fully open reasoning tokens. It's 671B parameters in size, with 37B active in an inference pass.\n\nFully open-source model & [technical report](https://api-docs.deepseek.com/news/news250120).\n\nMIT licensed: Distill & commercialize freely!",
      "pricing": {
        "prompt": "0.000003",
        "completion": "0.000008"
      }
    }
  ]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   async function loadModels() {
  //     try {
  //       const fetchedModels = await getModels();
  //       setModels(fetchedModels);
  //     } catch (error) {
  //       toast({
  //         title: "Error",
  //         description: "Failed to load available models. Please try again later.",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   loadModels();
  // }, []);

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // console.log(models)

  // if (isLoading) {
  //   return (
  //     <div className="space-y-4">
  //       <Input
  //         placeholder="Search models..."
  //         disabled
  //         className="mb-4"
  //       />
  //       <div className="space-y-4">
  //         {[1, 2, 3].map((i) => (
  //           <Card key={i} className="p-4">
  //             <div className="flex items-start space-x-4">
  //               <div className="h-4 w-4 rounded bg-muted animate-pulse" />
  //               <div className="flex-1 space-y-2">
  //                 <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
  //                 <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
  //                 <div className="h-3 w-1/4 bg-muted animate-pulse rounded" />
  //               </div>
  //             </div>
  //           </Card>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  if (!isExpanded) {
    return (
      <div className="grid grid-cols-6 gap-4 items-center">
        <div className="col-span-5 space-y-2">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {selectedModels.length} out of {models.length} models selected
          </p>
          <div className="flex flex-wrap gap-2">
            {models
              .filter((model) => selectedModels.includes(model.id))
              .map((model) => (
                <Card key={model.id} className="flex items-center gap-2 p-2 shrink-0">
                  <Checkbox
                    id={`simple-${model.id}`}
                    checked={true}
                    onCheckedChange={() => onModelToggle(model.id)}
                  />
                  <Label
                    htmlFor={`simple-${model.id}`}
                    className="text-sm whitespace-nowrap cursor-pointer"
                  >
                    {model.name}
                  </Label>
                </Card>
            ))}
          </div>
        </div>

        <div className="col-span-1 flex justify-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="flex flex-col items-center gap-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors py-1"
          >
            <Settings2 className="h-5 w-5" />
            <span className="text-sm tracking-wide text-center">
              Show all models
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 px-1">
        <Input
          placeholder="Search models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 h-11 bg-transparent border-0 border-b border-zinc-200 dark:border-zinc-800 rounded-none focus-visible:ring-0 focus-visible:border-zinc-400 dark:focus-visible:border-zinc-600 transition-colors px-0"
        />
        <button
          onClick={() => setIsExpanded(false)}
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors tracking-wide"
        >
          Simple view
        </button>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredModels.map((model) => (
            <button
              key={model.id}
              onClick={() => onModelToggle(model.id)}
              className={`group relative text-left transition-all duration-200 ${
                selectedModels.includes(model.id)
                  ? "bg-zinc-50 dark:bg-zinc-900"
                  : "bg-transparent hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <div className="px-3 py-2.5 space-y-1.5">
                {/* Selection indicator */}
                <div className="absolute left-0 top-0 h-full w-[2px] bg-zinc-900 dark:bg-zinc-100 opacity-0 transition-opacity duration-200
                              ${selectedModels.includes(model.id) ? 'opacity-100' : 'group-hover:opacity-30'}"
                />
                
                {/* Model name and selection state */}
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 transition-colors duration-200 ${
                    selectedModels.includes(model.id)
                      ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100"
                      : "border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-400 dark:group-hover:border-zinc-600"
                  }`} />
                  <span className="text-sm font-medium tracking-wide truncate">
                    {model.name}
                  </span>
                </div>

                {/* Pricing */}
                <div className="flex gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1">
                    <span>{formatModelPrice(Number(model.pricing.prompt), 0).input}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{formatModelPrice(0, Number(model.pricing.completion)).output}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          {filteredModels.length === 0 && (
            <div className="col-span-full flex items-center justify-center h-32">
              <span className="text-sm text-zinc-500 dark:text-zinc-400 tracking-wide">
                No models found matching your search
              </span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 