import React, { useState, useEffect } from "react";
import { SearchBar } from "../components/common/SearchBar";
import { FilterPanel } from "../components/transactions/FilterPanel";
import { CopyableAddress } from "../components/tokens/CopyableAddress";

// Define the transaction type
interface Transaction {
  id: string;  // Assuming each transaction has a unique ID
  tokenSymbol: string;
  tokenName: string;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  profitBnb: number;
  timestamp: string;
}

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("https://arb-bot-rlot.onrender.com/transactions")
      .then(response => response.json())
      .then((data: Transaction[]) => setTransactions(data))
      .catch(error => console.error("Error fetching transactions:", error));
  }, []);

  return (
    <div className="space-y-6">
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
              <th className="text-left pb-4">address</th>
              <th className="text-right pb-4">Buy Price</th>
              <th className="text-right pb-4">Sell Price</th>
              <th className="text-right pb-4">Profit (USD)</th>
              <th className="text-right pb-4">Profit (BNB)</th>
              <th className="text-right pb-4">Time</th>
            </tr>
          </thead>
          <tbody className="dark:text-white">
            {transactions.map(tx => (
              <tr key={tx.id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="py-4">
                  <div>
                    <span className="font-medium">{tx.tokenSymbol}</span>
                  </div>
                </td>
                <td className="text-right"><CopyableAddress address={tx.tokenName}/></td>
                <td className="text-right">${tx.buyPrice.toFixed(2)}</td>
                <td className="text-right">${tx.sellPrice.toFixed(2)}</td>
                <td className={`text-right ${tx.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {tx.profit >= 0 ? "+" : ""}{tx.profit.toFixed(2)} USD
                </td>
                <td className={`text-right ${tx.profitBnb >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {tx.profitBnb >= 0 ? "+" : ""}{tx.profitBnb.toFixed(3)} BNB
                </td>
                <td className="text-right text-slate-400">
                  {new Date(tx.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {transactions.map(tx => (
          <div key={tx.id} className="bg-white dark:border-slate-700 dark:bg-slate-800 rounded-lg p-4 border border-slate-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-medium dark:text-white">{tx.tokenSymbol}</span>

              </div>
              <span className="dark:text-slate-400 text-sm">{new Date(tx.timestamp).toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-slate-500">address</div>
              <div className="text-right dark:text-white"><CopyableAddress address={tx.tokenName} /></div>
              <div className="text-slate-500">Buy Price</div>
              <div className="text-right dark:text-white">${tx.buyPrice.toFixed(2)}</div>
              <div className="text-slate-500">Sell Price</div>
              <div className="text-right dark:text-white">${tx.sellPrice.toFixed(2)}</div>
              <div className="text-slate-500">Profit (USD)</div>
              <div className={`text-right ${tx.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                {tx.profit >= 0 ? "+" : ""}{tx.profit.toFixed(2)} USD
              </div>
              <div className="text-slate-500">Profit (BNB)</div>
              <div className={`text-right ${tx.profitBnb >= 0 ? "text-green-500" : "text-red-500"}`}>
                {tx.profitBnb >= 0 ? "+" : ""}{tx.profitBnb.toFixed(3)} BNB
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
