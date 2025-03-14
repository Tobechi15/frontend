import React from "react";
interface DataCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
}
export function DataCard({
  title,
  value,
  icon,
  change
}: DataCardProps) {
  return <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-slate-600 dark:text-slate-400 text-sm">{title}</h3>
        {icon && <div className="text-slate-600 dark:text-slate-400">{icon}</div>}
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-semibold text-slate-900 dark:text-white">
          {value}
        </span>
        {change && <span className={`ml-2 text-sm ${change.isPositive ? "text-green-500" : "text-red-500"}`}>
            {change.isPositive ? "+" : "-"}
            {Math.abs(change.value)}%
          </span>}
      </div>
    </div>;
}