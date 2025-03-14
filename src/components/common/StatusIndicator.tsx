import React from "react";
import { PowerIcon } from "lucide-react";
interface StatusIndicatorProps {
  isRunning: boolean;
  onToggle: () => void;
}
export function StatusIndicator({
  isRunning,
  onToggle
}: StatusIndicatorProps) {
  return <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isRunning ? "bg-green-500" : "bg-red-500"}`} />
        <span className="text-slate-900 dark:text-white">
          {isRunning ? "Bot Running" : "Bot Inactive"}
        </span>
      </div>
      <button onClick={onToggle} className={`p-2 rounded-full transition-colors ${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
        <PowerIcon className="w-5 h-5 text-white" />
      </button>
    </div>;
}