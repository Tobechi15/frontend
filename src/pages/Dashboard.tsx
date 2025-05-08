import React, { useState, useEffect } from "react";
import { WalletIcon, CoinsIcon, ArrowLeftRightIcon, DollarSignIcon } from "lucide-react";
import { StatusIndicator } from "../components/common/StatusIndicator";
import { DataCard } from "../components/common/DataCard";
import { CopyableAddress } from "../components/tokens/CopyableAddress";

interface Transaction {
  id: number;
  tokenSymbol: string;
  tokenName: string;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  profitBnb: number;
  profitUsd: number;
  realbndProfit: number;
  timestamp: number;
}

export function Dashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactions24h, setTransactions24h] = useState<number>(0);
  const [profitChange24h, setProfitChange24h] = useState<number>(0);
  const [profit24h, setProfit24h] = useState<number>(0);
  const [numTokens, setNumTokens] = useState<number>(0);
  const [balance, setBalance] = useState<string>("Loading...");
  const urll = 'https://arb-bot-b6wc.onrender.com';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, balanceRes, tokensRes, profitRes, yesterdayProfitRes] = await Promise.all([
          fetch(`${urll}/transactions/24h`),
          fetch(`${urll}/bal`),
          fetch(`${urll}/tokens`),
          fetch(`${urll}/profitBnb/24h`), 
          fetch(`${urll}/profitBnb/yesterday`)
        ]);

        if (!transactionsRes.ok || !balanceRes.ok || !tokensRes.ok || !profitRes.ok || !yesterdayProfitRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const transactionsData = await transactionsRes.json();
        const balanceData = await balanceRes.json();
        const tokensData = await tokensRes.json();
        const profitData = await profitRes.json();
        const yesterdayProfitData = await yesterdayProfitRes.json();

        setTransactions(transactionsData);
        setTransactions24h(transactionsData.length);
        setBalance(balanceData ? balanceData.toString() : "N/A");
        setNumTokens(tokensData.tokens?.length || 0);
        setProfit24h(Number(profitData.totalProfitBnb.toFixed(3)));

        // Calculate profit change percentage
        const totalProfitYesterday = Number(yesterdayProfitData.totalProfitBnb);
        let profitChange = 0;
        if (totalProfitYesterday > 0) {
          profitChange = ((profitData.totalProfitBnb - totalProfitYesterday) / totalProfitYesterday) * 100;
        } else if (profitData.totalProfitBnb > 0) {
          profitChange = 100;
        }

        setProfitChange24h(profitChange);

      } catch (error) {
        console.error("Error fetching data:", error);
        setBalance("Error");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {isRunning ? (
        <>
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
            <StatusIndicator isRunning={isRunning} setIsRunning={setIsRunning} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DataCard
              title="Wallet Balance"
              value={`${balance} BNB`}
              icon={<WalletIcon className="w-5 h-5" />}
              change={{ value: 2.5, isPositive: true }}
            />
            <DataCard title="Tokens Fetched" value={numTokens} icon={<CoinsIcon className="w-5 h-5" />} />
            <DataCard title="24h Transactions" value={transactions24h} icon={<ArrowLeftRightIcon className="w-5 h-5" />} />
            <DataCard
              title="24h Profit"
              value={`${profit24h} BNB`}
              icon={<DollarSignIcon className="w-5 h-5" />}
              change={{
                value: Math.abs(Number(profitChange24h.toFixed(2))),
                isPositive: profitChange24h >= 0,
              }}
            />
          </div>

          <div className="bg-transparent md:bg-white dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2 md:p-4 md:dark:p-6 md:border md:border-slate-200">
            <h2 className="text-lg font-semibold dark:text-white mb-4">Recent Transactions</h2>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-slate-400 text-sm">
                    <th className="text-left pb-4">Token Symbol</th>
                    <th className="text-left pb-4">Token address</th>
                    <th className="text-right pb-4">Buy Price</th>
                    <th className="text-right pb-4">Sell Price</th>
                    <th className="text-right pb-4">Profit</th>
                    <th className="text-right pb-4">Profit (BNB)</th>
                    <th className="text-right pb-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="dark:text-white">
                  
                  {transactions.slice(0, 6).map((tx) => (
                    console.log(tx),
                    <tr key={tx.id} className="border-t border-slate-200 dark:border-slate-700">
                      <td className="py-4">{tx.tokenSymbol}</td>
                      <td className="py-4"><CopyableAddress address={tx.tokenName} /></td>
                      <td className="text-right">${tx.buyPrice.toFixed(2)}</td>
                      <td className="text-right">${tx.sellPrice.toFixed(2)}</td>
                      <td className={`text-right ${tx.profitUsd >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {tx.profitUsd?.toFixed(2)}
                      </td>
                      <td className="text-right">{tx.profitBnb.toFixed(6)} BNB</td>
                      <td className="text-right text-slate-400">
                        {new Date(tx.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-4">
              {transactions.slice(0, 6).map((tx) => (
                <div key={tx.id} className="bg-white border-slate-200 dark:bg-slate-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium dark:text-white">{tx.tokenSymbol}</span>
                    <span className="text-sm text-slate-500">{new Date(tx.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-500">Token Name</div>
                    <div className="text-right dark:text-white"><CopyableAddress address={tx.tokenName} /></div>
                    <div className="text-slate-500">Buy Price</div>
                    <div className="text-right dark:text-white">${tx.buyPrice.toFixed(2)}</div>
                    <div className="text-slate-500">Sell Price</div>
                    <div className="text-right dark:text-white">${tx.sellPrice.toFixed(2)}</div>
                    <div className="text-slate-500">Profit</div>
                    <div className={`text-right ${tx.profitUsd >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {tx.profitUsd?.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <StatusIndicator isRunning={isRunning} setIsRunning={setIsRunning} />
      )}
    </div>
  );
}
