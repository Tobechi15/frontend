import React from "react";
interface ChartToggleProps {
  options: {
    label: string;
    value: string;
  }[];
  selected: string;
  onChange: (value: string) => void;
}
export function ChartToggle({
  options,
  selected,
  onChange
}: ChartToggleProps) {
  return <div className="flex space-x-4">
      {options.map(option => <button key={option.value} onClick={() => onChange(option.value)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selected === option.value ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}>
          {option.label}
        </button>)}
    </div>;
}