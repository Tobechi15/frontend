import React, { useState, useEffect } from "react";
import { SearchBar } from "../components/common/SearchBar";
import { FilterPanel } from "../components/transactions/FilterPanel";
import { WalletIcon, CoinsIcon, ArrowLeftRightIcon, DollarSignIcon } from "lucide-react";
import { CopyableAddress } from "../components/tokens/CopyableAddress";
import { DataCard } from "../components/common/DataCard";

interface Transaction {
  _id: string;
  tokenSymbol: string;
  tokenName: string;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  profitBnb: number;
  profitUsd: number;
  timestamp: string;
}

const ITEMS_PER_PAGE = 10;
const API_URL = "https://arb-bot-b6wc.onrender.com/transactions";
const API_TOTAL_PROFIT_BNB_URL = "https://arb-bot-b6wc.onrender.com/total-profit-bnb";

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalProfitBnb, setTotalProfitBnb] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
        const data = await response.json();

        setTransactions(data.transactions);
        setTotalPages(data.totalPages);
        setTotalTransactions(data.total);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalProfitBnb = async () => {
      try {
        const response = await fetch(API_TOTAL_PROFIT_BNB_URL);
        const data = await response.json();
        setTotalProfitBnb(data.totalProfitBnb);
      } catch (error) {
        console.error("Error fetching total profit BNB:", error);
      }
    };

    fetchTransactions();
    fetchTotalProfitBnb();
  }, [currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Transactions</h1>
      </div>
      <div className="space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search transactions..." />
        <FilterPanel onDateRangeChange={(start, end) => console.log(start, end)} onProfitRangeChange={(min, max) => console.log(min, max)} onTokenChange={token => console.log(token)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <DataCard title="Total Profit (BNB)" value={`${totalProfitBnb.toFixed(3)} BNB`} icon={<CoinsIcon className="w-5 h-5" />} />
        <DataCard title="Total Transactions" value={totalTransactions} icon={<ArrowLeftRightIcon className="w-5 h-5" />} />
      </div>

      {loading ? (
        <div className="text-center dark:text-white">Loading transactions...</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="bg-white dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2 border border-slate-200 hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-sm">
                  <th className="text-left pb-4">Token</th>
                  <th className="text-left pb-4">Address</th>
                  <th className="text-right pb-4">Buy Price</th>
                  <th className="text-right pb-4">Sell Price</th>
                  <th className="text-right pb-4">Profit (USD)</th>
                  <th className="text-right pb-4">Profit (BNB)</th>
                  <th className="text-right pb-4">Time</th>
                </tr>
              </thead>
              <tbody className="dark:text-white">
                {transactions.map(tx => (
                  <tr key={tx._id} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="py-4 font-medium">{tx.tokenSymbol}</td>
                    <td className="text-right"><CopyableAddress address={tx.tokenName} /></td>
                    <td className="text-right">${tx.buyPrice.toFixed(2)}</td>
                    <td className="text-right">${tx.sellPrice.toFixed(2)}</td>
                    <td className={`text-right ${tx.profitUsd >= 0 ? "text-green-500" : "text-red-500"}`}>{tx.profitUsd.toFixed(2)} USD</td>
                    <td className={`text-right ${tx.profitBnb >= 0 ? "text-green-500" : "text-red-500"}`}>{tx.profitBnb.toFixed(3)} BNB</td>
                    <td className="text-right text-slate-400">{new Date(tx.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {transactions.map(tx => (
              <div key={tx._id} className="bg-white dark:border-slate-700 dark:bg-slate-800 rounded-lg p-4 border border-slate-200">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-medium dark:text-white">{tx.tokenSymbol}</span>
                  <span className="dark:text-slate-400 text-sm">{new Date(tx.timestamp).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-500">Address</div>
                  <div className="text-right dark:text-white"><CopyableAddress address={tx.tokenName} /></div>
                  <div className="text-slate-500">Buy Price</div>
                  <div className="text-right dark:text-white">${tx.buyPrice.toFixed(2)}</div>
                  <div className="text-slate-500">Sell Price</div>
                  <div className="text-right dark:text-white">${tx.sellPrice.toFixed(2)}</div>
                  <div className="text-slate-500">Profit (USD)</div>
                  <div className={`text-right ${tx.profitUsd >= 0 ? "text-green-500" : "text-red-500"}`}>{tx.profitUsd.toFixed(2)} USD</div>
                  <div className="text-slate-500">Profit (BNB)</div>
                  <div className={`text-right ${tx.profitBnb >= 0 ? "text-green-500" : "text-red-500"}`}>{tx.profitBnb.toFixed(3)} BNB</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center space-x-4 mt-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50">Previous</button>
            <span className="px-4 py-2 dark:text-white">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50">Next</button>
          </div>
        </>
      )}
    </div>
  );
}
