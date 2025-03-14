import React, { useState } from "react";
import { SearchBar } from "../components/common/SearchBar";
import { FilterPanel } from "../components/transactions/FilterPanel";
// Mock data for demonstration
const mockTransactions = [{
  id: 1,
  token: {
    symbol: "ETH",
    name: "Ethereum"
  },
  buyPrice: 1800.5,
  sellPrice: 1850.75,
  profitUSD: 50.25,
  profitBNB: 0.15,
  timestamp: "2024-01-20T10:30:00"
}
// Add more mock transactions as needed
];
export function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Transactions</h1>
      </div>
      <div className="space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search transactions..." />
        <FilterPanel onDateRangeChange={(start, end) => console.log(start, end)} onProfitRangeChange={(min, max) => console.log(min, max)} onTokenChange={token => console.log(token)} />
      </div>
      {/* Desktop Table View */}
      <div className="bg-white dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2 border border-slate-200 hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-slate-400 text-sm">
              <th className="text-left pb-4">Token</th>
              <th className="text-right pb-4">Buy Price</th>
              <th className="text-right pb-4">Sell Price</th>
              <th className="text-right pb-4">Profit (USD)</th>
              <th className="text-right pb-4">Profit (BNB)</th>
              <th className="text-right pb-4">Time</th>
            </tr>
          </thead>
          <tbody className="dark:text-white">
            {mockTransactions.map(tx => <tr key={tx.id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="py-4">
                  <div>
                    <span className="font-medium">{tx.token.symbol}</span>
                    <span className="text-slate-400 text-sm ml-2">
                      {tx.token.name}
                    </span>
                  </div>
                </td>
                <td className="text-right">${tx.buyPrice.toFixed(2)}</td>
                <td className="text-right">${tx.sellPrice.toFixed(2)}</td>
                <td className={`text-right ${tx.profitUSD >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {tx.profitUSD >= 0 ? "+" : ""}
                  {tx.profitUSD.toFixed(2)} USD
                </td>
                <td className={`text-right ${tx.profitBNB >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {tx.profitBNB >= 0 ? "+" : ""}
                  {tx.profitBNB.toFixed(3)} BNB
                </td>
                <td className="text-right text-slate-400">
                  {new Date(tx.timestamp).toLocaleString()}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {mockTransactions.map(tx => <div key={tx.id} className="bg-white dark:border-slate-700 dark:bg-slate-800 rounded-lg p-4 border border-slate-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-medium dark:text-white">
                  {tx.token.symbol}
                </span>
                <span className="text-slate-400 text-sm ml-2">
                  {tx.token.name}
                </span>
              </div>
              <span className="dark:text-slate-400 text-sm">
                {new Date(tx.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-slate-500">Buy Price</div>
              <div className="text-right dark:text-white">
                ${tx.buyPrice.toFixed(2)}
              </div>
              <div className="text-slate-500">Sell Price</div>
              <div className="text-right dark:text-white">
                ${tx.sellPrice.toFixed(2)}
              </div>
              <div className="text-slate-500">Profit (USD)</div>
              <div className={`text-right ${tx.profitUSD >= 0 ? "text-green-500" : "text-red-500"}`}>
                {tx.profitUSD >= 0 ? "+" : ""}
                {tx.profitUSD.toFixed(2)} USD
              </div>
              <div className="text-slate-500">Profit (BNB)</div>
              <div className={`text-right ${tx.profitBNB >= 0 ? "text-green-500" : "text-red-500"}`}>
                {tx.profitBNB >= 0 ? "+" : ""}
                {tx.profitBNB.toFixed(3)} BNB
              </div>
            </div>
          </div>)}
      </div>
    </div>;
}