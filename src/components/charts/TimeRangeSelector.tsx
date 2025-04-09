import React from "react";

const timeRanges = [
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
  { label: "1M", value: "1m" },
  { label: "3M", value: "3m" },
  { label: "1Y", value: "1y" },
  { label: "ALL", value: "all" }
];

interface TimeRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export function TimeRangeSelector({
  selectedRange,
  onRangeChange
}: TimeRangeSelectorProps) {
  return (
    <div className="flex space-x-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            selectedRange === range.value
              ? "bg-blue-500 text-white"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
