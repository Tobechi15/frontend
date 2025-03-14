import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TimeRangeSelector } from "../components/charts/TimeRangeSelector";
import { ChartToggle } from "../components/charts/ChartToggle";
// Mock data
const generateData = (days: number) => {
  const data = [];
  let profit = 1000;
  let bnbProfit = 0.5;
  for (let i = 0; i < days; i++) {
    const growth = 1 + Math.random() * 0.1; // Random growth between 0-10%
    profit *= growth;
    bnbProfit *= growth;
    data.push({
      timestamp: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      profit: Math.round(profit),
      bnbProfit: Number(bnbProfit.toFixed(3)),
      projectedProfit: Math.round(profit * 1.2),
      projectedBnbProfit: Number((bnbProfit * 1.2).toFixed(3))
    });
  }
  return data;
};
export function Charts() {
  const [timeRange, setTimeRange] = useState("1m");
  const [chartType, setChartType] = useState("profit");
  const [showProjections, setShowProjections] = useState(true);
  // Generate different amounts of data based on time range
  const getData = () => {
    switch (timeRange) {
      case "1d":
        return generateData(24);
      case "1w":
        return generateData(7);
      case "1m":
        return generateData(30);
      case "3m":
        return generateData(90);
      case "1y":
        return generateData(365);
      default:
        return generateData(30);
    }
  };
  const data = getData();
  const chartOptions = [{
    label: "Profit (USD)",
    value: "profit"
  }, {
    label: "Profit (BNB)",
    value: "bnb"
  }];
  return <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl font-bold dark:text-white">Profit Charts</h1>
        <TimeRangeSelector selectedRange={timeRange} onRangeChange={setTimeRange} />
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <ChartToggle options={chartOptions} selected={chartType} onChange={setChartType} />
        <div className="flex items-center space-x-2">
          <label className="text-sm text-slate-400">Show Projections</label>
          <button onClick={() => setShowProjections(!showProjections)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showProjections ? "bg-blue-500" : "bg-slate-700"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showProjections ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border dark:border-slate-200">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="projectionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="timestamp" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={value => chartType === "profit" ? `$${value.toLocaleString()}` : `${value} BNB`} />
              <Tooltip contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "0.5rem"
            }} labelStyle={{
              color: "#9CA3AF"
            }} />
              <Area type="monotone" dataKey={chartType === "profit" ? "profit" : "bnbProfit"} stroke="#3B82F6" fill="url(#profitGradient)" strokeWidth={2} />
              {showProjections && <Area type="monotone" dataKey={chartType === "profit" ? "projectedProfit" : "projectedBnbProfit"} stroke="#10B981" fill="url(#projectionGradient)" strokeWidth={2} strokeDasharray="5 5" />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-medium dark:text-white mb-2">
            Current Profit
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">USD</span>
              <span className="dark:text-white font-medium">
                ${data[data.length - 1].profit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">BNB</span>
              <span className="dark:text-white font-medium">
                {data[data.length - 1].bnbProfit} BNB
              </span>
            </div>
          </div>
        </div>
        <div className="dark:bg-slate-800 rounded-lg p-6 border bg-white border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-medium dark:text-white mb-2">
            Projected Profit
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">USD</span>
              <span className="text-green-500 font-medium">
                ${data[data.length - 1].projectedProfit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">BNB</span>
              <span className="text-green-500 font-medium">
                {data[data.length - 1].projectedBnbProfit} BNB
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>;
}