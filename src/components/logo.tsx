
import { cn } from "@/lib/utils";

import { ChartCandlestick } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-blue-600 p-1.5 flex items-center justify-center shrink-0">
        <ChartCandlestick className="h-5 w-5 text-white" />
      </div>

    </div>
  );
}
