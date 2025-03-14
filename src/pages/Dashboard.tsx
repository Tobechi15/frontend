import React, { useState } from "react";
import { WalletIcon, CoinsIcon, ArrowLeftRightIcon } from "lucide-react";
import { StatusIndicator } from "../components/common/StatusIndicator";
import { DataCard } from "../components/common/DataCard";
const recentTransactions = [{
  id: 1,
  token: "ETH",
  amount: 1234.56,
  profit: 123.45,
  time: "2m ago"
}, {
  id: 2,
  token: "BTC",
  amount: 2345.67,
  profit: -45.67,
  time: "5m ago"
}, {
  id: 3,
  token: "SOL",
  amount: 3456.78,
  profit: 234.56,
  time: "10m ago"
}];
export function Dashboard() {
  const [isRunning, setIsRunning] = useState(false);
  return <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
        <StatusIndicator isRunning={isRunning} onToggle={() => setIsRunning(!isRunning)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DataCard title="Wallet Balance" value="$124,527.89" icon={<WalletIcon className="w-5 h-5" />} change={{
        value: 2.5,
        isPositive: true
      }} />
        <DataCard title="Tokens Fetched" value="1,234" icon={<CoinsIcon className="w-5 h-5" />} />
        <DataCard title="24h Transactions" value="156" icon={<ArrowLeftRightIcon className="w-5 h-5" />} change={{
        value: 12.3,
        isPositive: true
      }} />
      </div>
      <div className="bg-transperent md:bg-white dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2 md:dark:p-6 md:border md:border-slate-200">
        <h2 className="text-lg font-semibold dark:text-white mb-4">
          Recent Transactions
        </h2>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 text-sm">
                <th className="text-left pb-4">Token</th>
                <th className="text-right pb-4">Amount</th>
                <th className="text-right pb-4">Profit</th>
                <th className="text-right pb-4">Time</th>
              </tr>
            </thead>
            <tbody className="dark:text-white">
              {recentTransactions.map(tx => <tr key={tx.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="py-4">{tx.token}</td>
                  <td className="text-right">${tx.amount.toFixed(2)}</td>
                  <td className={`text-right ${tx.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {tx.profit >= 0 ? "+" : ""}
                    {tx.profit.toFixed(2)}
                  </td>
                  <td className="text-right text-slate-400">{tx.time}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-4">
          {recentTransactions.map(tx => <div key={tx.id} className="bg-white border-slate-200 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium dark:text-white">{tx.token}</span>
                <span className="text-sm text-slate-500">{tx.time}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-500">Amount</div>
                <div className="text-right dark:text-white">
                  ${tx.amount.toFixed(2)}
                </div>
                <div className="text-slate-500">Profit</div>
                <div className={`text-right ${tx.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {tx.profit >= 0 ? "+" : ""}
                  {tx.profit.toFixed(2)}
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
}