import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Bar, BarChart } from "recharts";
import { TimeRangeSelector } from "../components/charts/TimeRangeSelector";
import { ChartToggle } from "../components/charts/ChartToggle";

const API_URL = "https://arb-bot-b6wc.onrender.com"; // Your API base URL

export function Charts() {
  const [timeRange, setTimeRange] = useState("1m"); // Default time range is "1m"
  const [chartType, setChartType] = useState("profit");
  const [showProjections, setShowProjections] = useState(true);
  const [data, setData] = useState<any[]>([]); // State to hold the fetched chart data
  const [Timedata, setTimeData] = useState<any[]>([]); // State to hold the fetched chart data
  const [currentProfit, setCurrentProfit] = useState<number>(0);
  const [projectedProfit, setProjectedProfit] = useState<number>(0);
  const [currentProfitBnb, setCurrentProfitBnb] = useState<number>(0);
  const [projectedProfitBnb, setProjectedProfitBnb] = useState<number>(0);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(false);
  
    useEffect(() => {
      const checkDark = () => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
      };
  
      checkDark(); // Initial check
  
      // Set up a MutationObserver to detect changes in class attribute
      const observer = new MutationObserver(checkDark);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  
      return () => observer.disconnect();
    }, []);
  
    return isDarkMode;
  }

  // Function to fetch chart data based on the selected time range
  const fetchChartData = async (range: string) => {
    try {
      const response = await fetch(`${API_URL}/transactions/range/${range}`);
      const transactions = await response.json();

      // Initialize variables for cumulative calculations
      let cumulativeUSD = 0;
      let cumulativeBNB = 0;
      let totalProfit = 0;
      let totalProfitBnb = 0;
      let totalProjProfit = 0;
      let totalProjProfitBnb = 0;
      let totalTx = transactions.length;

      const processedData = transactions.map((transaction: any) => {
        // Update the cumulative profit
        cumulativeUSD += transaction.profitUsd || 0;
        cumulativeBNB += transaction.profitBnb || 0;
        totalProfit = cumulativeUSD;
        totalProfitBnb = cumulativeBNB;
        totalProjProfit = cumulativeUSD * 1.2;
        totalProjProfitBnb = cumulativeBNB * 1.2; // 20% increase for projections

        // Format the timestamp to be used in the chart label
        const label = new Date(transaction.timestamp).toLocaleDateString();

        return {
          timestamp: label,
          profit: Number(cumulativeUSD.toFixed(2)),
          bnbProfit: Number(cumulativeBNB.toFixed(4)),
          projectedProfit: Number((cumulativeUSD * 1.2).toFixed(2)), // 20% increase for projections
          projectedBnbProfit: Number((cumulativeBNB * 1.2).toFixed(4)) // 20% increase for projections
        };
      });

      let USD = 0;
      let BNB = 0;
      let totaltimeProfit = 0;
      let totaltimeProfitBnb = 0;
      let totaltimeProjProfit = 0;
      let totaltimeProjProfitBnb = 0;

      const groupedData = new Map<string, { profit: number; bnbProfit: number }>();

      transactions.forEach((transaction: any) => {
        const label = new Date(transaction.timestamp).toLocaleDateString();

        // If group exists, add to it; else, create new group
        if (!groupedData.has(label)) {
          groupedData.set(label, { profit: 0, bnbProfit: 0 });
        }

        const group = groupedData.get(label)!;
        group.profit += transaction.profitUsd || 0;
        group.bnbProfit += transaction.profitBnb || 0;
      });

      // Now, format the grouped data for chart
      const processedtimeData = Array.from(groupedData.entries()).map(([timestamp, values]) => {
        const profit = values.profit;
        const bnbProfit = values.bnbProfit;

        return {
          timestamp,
          profit: Number(profit.toFixed(2)),
          bnbProfit: Number(bnbProfit.toFixed(4)),
          projectedProfit: Number((profit * 1.2).toFixed(2)), // 20% projection
          projectedBnbProfit: Number((bnbProfit * 1.2).toFixed(4))
        };
      });

      // Set the summarized data
      setTimeData(processedtimeData);;
      setData(processedData);
      setCurrentProfit(totalProfit);
      setProjectedProfit(totalProjProfit);
      setCurrentProfitBnb(totalProfitBnb);
      setProjectedProfitBnb(totalProjProfitBnb);
      setTotalTransactions(totalTx);

    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  // Fetch data when the timeRange state changes
  useEffect(() => {
    fetchChartData(timeRange);
  }, [timeRange]);

  const isDarkMode = useDarkMode();

  // Chart options
  const chartOptions = [
    { label: "Profit (USD)", value: "profit" },
    { label: "Profit (BNB)", value: "bnb" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl font-bold dark:text-white">Profit Charts</h1>
        <TimeRangeSelector selectedRange={timeRange} onRangeChange={setTimeRange} />
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <ChartToggle options={chartOptions} selected={chartType} onChange={setChartType} />
        <div className="flex items-center space-x-2">
          <label className="text-sm text-slate-400">Show Projections</label>
          <button
            onClick={() => setShowProjections(!showProjections)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showProjections ? "bg-blue-500" : "bg-slate-700"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showProjections ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>
      </div>

      <h1 className="text-xl font-bold dark:text-white">Cummulative Profit</h1>
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
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1F2937" : "#ffffff",
                  border: isDarkMode ? "1px solid #374151" : "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  color: isDarkMode ? "#9CA3AF" : "#374151",
                }}
                labelStyle={{
                  color: isDarkMode ? "#9CA3AF" : "#374151",
                }}
              />
              <Area type="monotone" dataKey={chartType === "profit" ? "profit" : "bnbProfit"} stroke="#3B82F6" fill="url(#profitGradient)" strokeWidth={2} />
              {showProjections && <Area type="monotone" dataKey={chartType === "profit" ? "projectedProfit" : "projectedBnbProfit"} stroke="#10B981" fill="url(#projectionGradient)" strokeWidth={2} strokeDasharray="5 5" />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <h1 className="text-xl font-bold dark:text-white">Daily Profit Analysis</h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border dark:border-slate-200">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Timedata}>
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
              
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1F2937" : "#ffffff",
                  border: isDarkMode ? "1px solid #374151" : "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  color: isDarkMode ? "#9CA3AF" : "#374151",
                }}
                labelStyle={{
                  color: isDarkMode ? "#9CA3AF" : "#374151",
                }}
              />

              <Bar type="monotone" dataKey={chartType === "profit" ? "profit" : "bnbProfit"} stroke="#3B82F6" fill="url(#profitGradient)" strokeWidth={2} />
              {showProjections && <Bar type="monotone" dataKey={chartType === "profit" ? "projectedProfit" : "projectedBnbProfit"} stroke="#10B981" fill="url(#projectionGradient)" strokeWidth={2} strokeDasharray="5 5" />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-medium dark:text-white mb-2">Current Profit</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">USD</span>
              <span className="dark:text-white font-medium">${currentProfit?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">BNB</span>
              <span className="dark:text-white font-medium">{currentProfitBnb?.toFixed(4)} BNB</span>
            </div>
          </div>
        </div>
        <div className="dark:bg-slate-800 rounded-lg p-6 border bg-white border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-medium dark:text-white mb-2">Projected Profit</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">USD</span>
              <span className="text-green-500 font-medium">${projectedProfit?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">BNB</span>
              <span className="text-green-500 font-medium">
                {projectedProfitBnb?.toFixed(4)} BNB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Total Transactions */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border dark:border-slate-200">
          <h2 className="text-lg font-medium text-slate-600 dark:text-slate-300">Total Transactions</h2>
          <p className="text-xl font-semibold text-slate-600 dark:text-slate-300">{totalTransactions}</p>
        </div>

        {/* Additional Stats */}
        {/* Add more stat boxes here, such as average profit per transaction, etc. */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border dark:border-slate-200">
          <h2 className="text-lg font-medium text-slate-600 dark:text-slate-300">Average Profit per Transaction</h2>
          <p className="text-xl font-semibold text-slate-600 dark:text-slate-300">${(currentProfit / totalTransactions).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
