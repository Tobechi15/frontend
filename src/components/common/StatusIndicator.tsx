import React from "react";
import { PowerIcon } from "lucide-react";

interface StatusIndicatorProps {
  isRunning: boolean;
  onToggle: () => void;
}

export function StatusIndicator({ isRunning, onToggle }: StatusIndicatorProps) {
  if (!isRunning) {
    return (
      <div className="flex items-center justify-center mt-[-115px] h-screen bg-gray-900">
        <button
          onClick={onToggle}
          className="rounded-full p-4 text-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition-all"
        >
          <PowerIcon className="w-40 h-40 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-slate-900 dark:text-white">Bot Running</span>
      </div>
      <button
        onClick={onToggle}
        className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
      >
        <PowerIcon className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
