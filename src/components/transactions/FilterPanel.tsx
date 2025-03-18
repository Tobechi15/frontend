import React from "react";
interface FilterPanelProps {
  onDateRangeChange: (start: string, end: string) => void;
  onProfitRangeChange: (min: string, max: string) => void;
  onTokenChange: (token: string) => void;
}
export function FilterPanel({
  onDateRangeChange,
  onProfitRangeChange,
  onTokenChange
}: FilterPanelProps) {
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
          Date Range
        </label>
        <div className="flex space-x-2">
          <input type="date" onChange={e => onDateRangeChange(e.target.value, "")} className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
          <input type="date" onChange={e => onDateRangeChange("", e.target.value)} className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
          Profit Range
        </label>
        <div className="flex-1 md:space-x-2 md:flex lg:flex">
          <input type="number" placeholder="Min" onChange={e => onProfitRangeChange(e.target.value, "")} className="w-full flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
          <input type="number" placeholder="Max" onChange={e => onProfitRangeChange("", e.target.value)} className="w-full flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
          Token Symbol
        </label>
        <input type="text" placeholder="Enter token symbol" onChange={e => onTokenChange(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
      </div>
    </div>;
}